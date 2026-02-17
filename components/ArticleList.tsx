"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Post } from "@/lib/posts";
import { Dictionary } from "@/lib/types";

interface ArticleListProps {
    posts: Post[];
    dict: Dictionary;
}

const ITEMS_PER_PAGE = 10;

/**
 * ArticleList Component
 * 
 * Displays a list of recent blog posts with pagination.
 * 
 * @param posts - Array of Post objects.
 * @param dict - Localized dictionary data.
 */
export function ArticleList({ posts, dict }: ArticleListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // Optional: Scroll to top of list
        const listElement = document.getElementById('article-list-top');
        if (listElement) {
            listElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-2xl space-y-4" id="article-list-top">
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-6 px-2 flex justify-between items-end"
            >
                <span>{dict.articles.title}</span>
                {totalPages > 1 && (
                    <span className="text-sm font-normal text-white/40">
                        Page {currentPage} of {totalPages}
                    </span>
                )}
            </motion.h2>

            <div className="grid gap-4">
                {currentPosts.map((post, index) => (
                    <ArticleCard key={post.slug} post={post} index={index} dict={dict} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-8 pt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

/**
 * ArticleCard Component
 * 
 * Renders a single blog post card with glassmorphism style.
 */
function ArticleCard({ post, index, dict }: { post: Post; index: number; dict: Dictionary }) {
    const formattedDate = new Date(post.date).toLocaleDateString(dict.articles.date.includes('年') ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
        >
            <Link href={`/posts/${post.slug}`} className="block">
                <div className="glass-hover glass rounded-2xl p-6 relative group cursor-pointer border border-white/5 hover:border-white/20">
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-xs text-white/40 mb-1">
                            <span>{formattedDate}</span>
                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span>•</span>
                                    <div className="flex gap-2">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="bg-white/5 px-2 py-0.5 rounded text-white/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <h3 className="text-xl font-semibold text-white/90 group-hover:text-indigo-300 transition-colors mb-1">
                            {post.title}
                        </h3>
                        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                            {post.description}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
