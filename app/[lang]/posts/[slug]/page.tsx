import { getPostData, getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

// @ts-ignore
import translate from "@iamtraction/google-translate";
import { TranslationBanner } from "@/components/TranslationBanner";
import fs from "fs/promises";
import path from "path";

// Simple Markdown Fixer to repair common translation artifacts
function repairMarkdown(text: string): string {
    return text
        // Fix headers: "#Title" -> "# Title"
        .replace(/^(#+)([^#\s])/gm, '$1 $2')
        // Fix lists: "-Item" -> "- Item"
        .replace(/^(\s*[-*])([^\s])/gm, '$1 $2')
        // Fix blockquotes: ">Text" -> "> Text"
        .replace(/^(\s*>)([^\s])/gm, '$1 $2');
}

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    // Generate params for both languages
    const params = [];
    for (const post of posts) {
        params.push({ lang: 'en', slug: post.slug });
        params.push({ lang: 'zh', slug: post.slug });
    }
    return params;
}

export default async function Post({ params }: { params: Promise<{ slug: string; lang: "en" | "zh" }> }) {
    const { slug, lang } = await params;
    let post = await getPostData(slug);
    let isTranslated = false;
    let mdxContent;

    // Auto-translation logic
    if (post.lang && post.lang !== lang) {
        const cacheDir = path.join(process.cwd(), 'posts', 'cache');
        const cacheFile = path.join(cacheDir, `${slug}-${lang}.json`);

        try {
            // Check cache first
            try {
                const cacheData = await fs.readFile(cacheFile, 'utf8');
                const cached = JSON.parse(cacheData);
                post.title = cached.title;
                post.content = cached.content;
                isTranslated = true;

                // Compile cached content
                const { content: compiledContent } = await compileMDX({
                    source: cached.content,
                    options: {
                        parseFrontmatter: true,
                        mdxOptions: {
                            rehypePlugins: [
                                [rehypePrettyCode, {
                                    theme: 'catppuccin-macchiato',
                                    keepBackground: true,
                                }]
                            ]
                        }
                    }
                });
                mdxContent = compiledContent;
            } catch (cacheError) {
                // Cache miss or invalid, proceed to translate
                const targetLang = lang === 'zh' ? 'zh-CN' : lang;

                // Translate title
                const titleRes = await translate(post.title, { to: targetLang });
                const translatedTitle = titleRes.text;

                // Translate content excluding code blocks
                const originalPostContent = post.content || '';
                const codeBlockRegex = /(```[\s\S]*?```)/g;
                const parts = originalPostContent.split(codeBlockRegex);

                const translatedParts = await Promise.all(parts.map(async (part) => {
                    // If part is a code block (starts with ```), return as is
                    if (part.trim().startsWith('```')) {
                        return part;
                    }
                    // Otherwise translate text (skip empty/whitespace only strings)
                    if (!part.trim()) return part;

                    try {
                        const res = await translate(part, { to: targetLang });
                        return repairMarkdown(res.text);
                    } catch (e) {
                        return part;
                    }
                }));

                // Join with newlines to ensure code blocks don't stick to text
                const translatedContent = translatedParts.join('\n\n');

                try {
                    // Try to compile translated content to check for validity
                    const { content: compiledContent } = await compileMDX({
                        source: translatedContent,
                        options: {
                            parseFrontmatter: true,
                            mdxOptions: {
                                rehypePlugins: [
                                    [rehypePrettyCode, {
                                        theme: 'catppuccin-macchiato',
                                        keepBackground: true,
                                    }]
                                ]
                            }
                        }
                    });

                    // Update post object with translated content
                    post.title = translatedTitle;
                    post.content = translatedContent;
                    mdxContent = compiledContent; // Store valid translated MDX
                    isTranslated = true;

                    // Save to cache
                    await fs.mkdir(cacheDir, { recursive: true });
                    await fs.writeFile(cacheFile, JSON.stringify({
                        title: translatedTitle,
                        content: translatedContent
                    }));

                } catch (compileError) {
                    console.error("Translated MDX compilation failed, falling back to original:", compileError);
                    throw compileError; // Re-throw to trigger outer catch block fallback
                }
            }

        } catch (e) {
            console.error("Translation logic/compilation failed:", e);
            // Fallback to original content compilation
            const { content: originalCompiled } = await compileMDX({
                source: post.content || '',
                options: {
                    parseFrontmatter: true,
                    mdxOptions: {
                        rehypePlugins: [
                            [rehypePrettyCode, {
                                theme: 'catppuccin-macchiato',
                                keepBackground: true,
                            }]
                        ]
                    }
                }
            });
            mdxContent = originalCompiled;
            isTranslated = false;
        }
    } else {
        // No translation needed
        const { content: originalCompiled } = await compileMDX({
            source: post.content || '',
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    rehypePlugins: [
                        [rehypePrettyCode, {
                            theme: 'catppuccin-macchiato',
                            keepBackground: true,
                        }]
                    ]
                }
            }
        });
        mdxContent = originalCompiled;
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-24 flex justify-center">
            <div className="max-w-3xl w-full">
                <Link
                    href={`/${lang}`}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'zh' ? '返回首页' : 'Back to Home'}
                </Link>

                {isTranslated && <TranslationBanner lang={lang} />}

                <article className="prose prose-invert prose-lg max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-white/40 mb-12">
                        <time>{post.date}</time>
                    </div>

                    <div className="mdx-content">
                        {mdxContent}
                    </div>
                </article>
            </div>
        </main>
    );
}
