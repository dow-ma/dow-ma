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
import { getDictionary } from "@/lib/get-dictionary";

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

export default async function Post({
    params,
    searchParams
}: {
    params: Promise<{ slug: string; lang: "en" | "zh" }>;
    searchParams: Promise<{ view?: string }>;
}) {
    const { slug, lang } = await params;
    const { view } = await searchParams;
    const dict = await getDictionary(lang);
    let post = await getPostData(slug);

    // Original content reference for fallback or toggle
    const originalPostTitle = post.title;
    const originalPostContent = post.content || '';

    let isTranslated = false;
    let mdxContent;
    const isViewingOriginal = view === 'original';

    // Auto-translation logic
    if (post.lang && post.lang !== lang && !isViewingOriginal) {
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
                const codeBlockRegex = /(```[\s\S]*?```)/g;
                const parts = originalPostContent.split(codeBlockRegex);

                const translatedParts = await Promise.all(parts.map(async (part) => {
                    if (part.trim().startsWith('```')) {
                        return part;
                    }
                    if (!part.trim()) return part;

                    try {
                        const res = await translate(part, { to: targetLang });
                        return repairMarkdown(res.text);
                    } catch (e) {
                        return part;
                    }
                }));

                // Join with double newlines
                const translatedContent = translatedParts.join('\n\n');

                try {
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

                    post.title = translatedTitle;
                    post.content = translatedContent;
                    mdxContent = compiledContent;
                    isTranslated = true;

                    // WRAP CACHE WRITE IN TRY-CATCH to prevent failure on read-only environments
                    try {
                        await fs.mkdir(cacheDir, { recursive: true });
                        await fs.writeFile(cacheFile, JSON.stringify({
                            title: translatedTitle,
                            content: translatedContent
                        }));
                    } catch (fsWriteError) {
                        console.warn("Could not write translation cache (likely a read-only production environment):", fsWriteError);
                    }

                } catch (compileError) {
                    console.error("Translated MDX compilation failed, falling back to original:", compileError);
                    throw compileError;
                }
            }

        } catch (e) {
            console.error("Translation logic/compilation failed:", e);
            const { content: originalCompiled } = await compileMDX({
                source: originalPostContent,
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
        // No translation needed or explicit original view
        const { content: originalCompiled } = await compileMDX({
            source: originalPostContent,
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

        // Even in original view, we show the banner if translation is available/possible
        if (post.lang && post.lang !== lang) {
            isTranslated = true;
        }
    }

    const toggleUrl = isViewingOriginal ? `/${lang}/posts/${slug}` : `/${lang}/posts/${slug}?view=original`;

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

                {isTranslated && (
                    <TranslationBanner
                        lang={lang}
                        isViewingOriginal={isViewingOriginal}
                        toggleUrl={toggleUrl}
                        labels={{
                            viewOriginal: dict.articles.viewOriginal,
                            viewTranslated: dict.articles.viewTranslated
                        }}
                    />
                )}

                <article className="prose prose-invert prose-lg max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6 !leading-tight" style={{ WebkitTextFillColor: 'transparent' }}>
                        {isViewingOriginal ? originalPostTitle : post.title}
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
