import { getPostData, getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

// @ts-ignore
import translate from "@iamtraction/google-translate";
import { TranslationBanner } from "@/components/TranslationBanner";

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

    // Auto-translation logic
    if (post.lang && post.lang !== lang) {
        try {
            const targetLang = lang === 'zh' ? 'zh-CN' : lang;

            // Translate title
            const titleRes = await translate(post.title, { to: targetLang });
            post.title = titleRes.text;

            // Translate content excluding code blocks
            const content = post.content || '';
            const codeBlockRegex = /(```[\s\S]*?```)/g;
            const parts = content.split(codeBlockRegex);

            const translatedParts = await Promise.all(parts.map(async (part) => {
                // If part is a code block (starts with ```), return as is
                if (part.trim().startsWith('```')) {
                    return part;
                }
                // Otherwise translate text (skip empty/whitespace only strings)
                if (!part.trim()) return part;

                try {
                    const res = await translate(part, { to: targetLang });
                    return res.text;
                } catch (e) {
                    return part;
                }
            }));

            post.content = translatedParts.join('');

            isTranslated = true;
        } catch (e) {
            console.error("Translation failed:", e);
        }
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-24 flex justify-center">
            <div className="max-w-3xl w-full">
                <Link
                    href={`/${lang}`}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'zh' ? '返回首页' : 'Back to Home'}
                </Link>

                <article className="prose prose-invert prose-lg max-w-none">
                    {isTranslated && <TranslationBanner lang={lang} />}

                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-white/40 mb-12">
                        <time>{post.date}</time>
                    </div>

                    <div className="mdx-content">
                        <MDXRemote
                            source={post.content || ''}
                            options={{
                                parseFrontmatter: true,
                                mdxOptions: {
                                    rehypePlugins: [
                                        [rehypePrettyCode, {
                                            theme: 'catppuccin-macchiato',
                                            keepBackground: true,
                                        }]
                                    ]
                                }
                            }}
                        />
                    </div>
                </article>
            </div>
        </main>
    );
}
