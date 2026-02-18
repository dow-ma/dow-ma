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
import { Background } from "@/components/Background";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Languages } from "lucide-react";

function repairMarkdown(text: string): string {
    return text
        .replace(/^(#+)([^#\s])/gm, '$1 $2')
        .replace(/^(\s*[-*])([^\s])/gm, '$1 $2')
        .replace(/^(\s*>)([^\s])/gm, '$1 $2');
}

export async function generateStaticParams() {
    const posts = getSortedPostsData();
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

    const originalPostTitle = post.title;
    const originalPostContent = post.content || '';

    let isTranslated = false;
    let mdxContent;
    const isViewingOriginal = view === 'original';

    if (post.lang && post.lang !== lang && !isViewingOriginal) {
        const cacheDir = path.join(process.cwd(), 'posts', 'cache');
        const cacheFile = path.join(cacheDir, `${slug}-${lang}.json`);

        try {
            try {
                const cacheData = await fs.readFile(cacheFile, 'utf8');
                const cached = JSON.parse(cacheData);

                // If original file is newer than cache, re-translate
                if (cached.mtime !== post.mtime) {
                    throw new Error("Cache stale");
                }

                post.title = cached.title;
                post.content = cached.content;
                isTranslated = true;

                const { content: compiledContent } = await compileMDX({
                    source: cached.content,
                    options: {
                        parseFrontmatter: true,
                        mdxOptions: {
                            rehypePlugins: [
                                [rehypePrettyCode, {
                                    theme: 'solarized-dark',
                                    keepBackground: true,
                                }]
                            ]
                        }
                    }
                });
                mdxContent = compiledContent;
            } catch (cacheError) {
                const targetLang = lang === 'zh' ? 'zh-CN' : lang;
                const titleRes = await translate(post.title, { to: targetLang });
                const translatedTitle = titleRes.text;

                const codeBlockRegex = /(```[\s\S]*?```)/g;
                const parts = originalPostContent.split(codeBlockRegex);

                const translatedParts = await Promise.all(parts.map(async (part: string) => {
                    if (part.trim().startsWith('```')) return part;
                    if (!part.trim()) return part;
                    try {
                        const res = await translate(part, { to: targetLang });
                        return repairMarkdown(res.text);
                    } catch (e) {
                        return part;
                    }
                }));

                const translatedContent = translatedParts.join('\n\n');

                try {
                    const { content: compiledContent } = await compileMDX({
                        source: translatedContent,
                        options: {
                            parseFrontmatter: true,
                            mdxOptions: {
                                rehypePlugins: [
                                    [rehypePrettyCode, {
                                        theme: 'solarized-dark',
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

                    try {
                        await fs.mkdir(cacheDir, { recursive: true });
                        await fs.writeFile(cacheFile, JSON.stringify({
                            title: translatedTitle,
                            content: translatedContent,
                            mtime: post.mtime
                        }));
                    } catch (fsWriteError) {
                        console.warn("Cache write failed:", fsWriteError);
                    }
                } catch (compileError) {
                    throw compileError;
                }
            }
        } catch (e) {
            const { content: originalCompiled } = await compileMDX({
                source: originalPostContent,
                options: {
                    parseFrontmatter: true,
                    mdxOptions: {
                        rehypePlugins: [
                            [rehypePrettyCode, {
                                theme: 'solarized-dark',
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
        const { content: originalCompiled } = await compileMDX({
            source: originalPostContent,
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    rehypePlugins: [
                        [rehypePrettyCode, {
                            theme: 'solarized-dark',
                            keepBackground: true,
                        }]
                    ]
                }
            }
        });
        mdxContent = originalCompiled;
        if (post.lang && post.lang !== lang) isTranslated = true;
    }

    const toggleUrl = isViewingOriginal ? `/${lang}/posts/${slug}` : `/${lang}/posts/${slug}?view=original`;

    return (
        <main className="min-h-screen text-foreground p-6 md:p-12 lg:p-20 flex justify-center relative">
            <Background />

            <div className="max-w-3xl w-full relative">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href={`/${lang}`}
                        className="wire-btn"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-[11px] font-black uppercase">{lang === 'zh' ? 'Return_Home' : 'Return_Home'}</span>
                    </Link>

                    <div className="flex gap-2">
                        <ThemeToggle variant="button" />
                        <Link
                            href={lang === 'en' ? `/zh/posts/${slug}` : `/en/posts/${slug}`}
                            className="wire-btn"
                        >
                            <Languages size={14} />
                            <span className="text-[11px] font-black uppercase text-foreground/80">{lang === 'en' ? 'ZH' : 'EN'}</span>
                        </Link>
                    </div>
                </div>

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

                <article className="max-w-none">
                    <header className="wire-box mb-6 overflow-hidden">
                        <div className="wire-header">
                            <span>ARTICLE / CONTENT_VIEWER</span>
                        </div>
                        <div className="pt-6 pb-8 px-6 md:px-10">
                            <h1 className="text-2xl md:text-4xl font-black text-primary !m-0 leading-tight tracking-tight">
                                {`> ${isViewingOriginal ? originalPostTitle : post.title}`}
                            </h1>
                            <div className="flex items-center gap-6 font-black opacity-30 text-[9px] uppercase mt-4">
                                <span>DATE: {post.date}</span>
                                <span className="text-primary opacity-100">|</span>
                                <span>STATUS: PUBLISHED</span>
                            </div>
                        </div>
                    </header>

                    <div className="prose">
                        <div className="mdx-content">
                            {mdxContent}
                        </div>
                    </div>
                </article>

                <footer className="mt-20 py-12 border-t border-border/20 text-center opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {`>> EOF / END_OF_FILE <<`}
                    </span>
                </footer>
            </div>
        </main>
    );
}
