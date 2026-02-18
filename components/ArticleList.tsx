"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Hash, Terminal, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { Dictionary } from "@/lib/types";

interface ArticleListProps {
    posts: Post[];
    dict: Dictionary;
    lang: "en" | "zh";
}

const ITEMS_PER_PAGE = 10;

export function ArticleList({ posts, dict, lang }: ArticleListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const listElement = document.getElementById('article-list-top');
        if (listElement) {
            listElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-2xl space-y-6" id="article-list-top">
            <header className="wire-box overflow-hidden">
                <div className="wire-header">
                    <Terminal size={12} />
                    <span>Archive_System / Index</span>
                </div>
                <div className="p-4 flex justify-between items-center bg-background">
                    <h2 className="text-xl font-black uppercase tracking-tight">
                        {`# ${dict.articles.title}`}
                    </h2>
                    <span className="text-[10px] font-bold opacity-30">
                        {`COUNT: ${posts.length} / PAGE: ${currentPage}_${totalPages}`}
                    </span>
                </div>
            </header>

            <div className="grid gap-4">
                {currentPosts.map((post, index) => (
                    <ArticleCard key={post.slug} post={post} index={index} dict={dict} lang={lang} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="wire-box p-4 flex justify-center gap-6 bg-foreground/[0.02]">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="wire-btn"
                    >
                        {`<<_PREV`}
                    </button>
                    <div className="flex items-center text-[10px] font-bold italic opacity-30">
                        {`PAGE_NAV_CTRL`}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="wire-btn"
                    >
                        {`NEXT_>>`}
                    </button>
                </div>
            )}
        </div>
    );
}

function ArticleCard({ post, index, dict, lang }: { post: Post; index: number; dict: Dictionary; lang: "en" | "zh" }) {
    const formattedDate = new Date(post.date).toLocaleDateString(dict.articles.date.includes('年') ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
        >
            <Link href={`/${lang}/posts/${post.slug}`} className="block group">
                <div className="wire-box hover:border-primary transition-colors">
                    <div className="wire-header justify-between py-1 px-4 bg-foreground/[0.03]">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 opacity-50">
                                <Calendar size={10} />
                                {formattedDate}
                            </span>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex gap-2">
                                    {post.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="flex items-center gap-1 text-primary lowercase">
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[9px] opacity-20 font-bold group-hover:opacity-100 group-hover:text-primary">00{index + 1}_REF</span>
                    </div>

                    <div className="p-6 bg-background group-hover:bg-primary/[0.02] transition-colors">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm font-bold opacity-50 line-clamp-2 leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                            <ArrowUpRight size={16} className="text-foreground/20 group-hover:text-primary transition-all shrink-0 mt-1" />
                        </div>
                    </div>

                    {/* Visual Bottom Bar */}
                    <div className="h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-300" />
                </div>
            </Link>
        </motion.div>
    );
}
