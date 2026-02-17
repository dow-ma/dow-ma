"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Code2, Terminal, Github, ArrowUpRight, Mail, RefreshCw, Layers, Link as LinkIcon, LucideIcon } from "lucide-react";
import { Dictionary, Project } from "@/lib/types";

import projectsDataRaw from "@/data/projects.json";

const projectsData = projectsDataRaw as Project[];

/**
 * Filter valid projects (must have a name)
 */
const validProjects = projectsData.filter(project => project.name && project.name.trim() !== "");

/**
 * ProfileCard Component
 * 
 * Displays the user's profile information in a 3D flip card format.
 * - Front: Bio, role, badges, and social links.
 * - Back: List of current projects.
 * 
 * @param dict - Localized dictionary data.
 * @param lang - Current language ("en" | "zh").
 */
export function ProfileCard({ dict, lang }: { dict: Dictionary; lang: "en" | "zh" }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const hasProjects = validProjects.length > 0;

    return (
        <div className="w-full max-w-2xl h-[600px] md:h-[400px] perspective-1000 relative group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT FACE */}
                <div
                    className={`absolute inset-0 backface-hidden ${isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
                >
                    <CardContent dict={dict} onFlip={() => setIsFlipped(true)} hasProjects={hasProjects} />
                </div>

                {/* BACK FACE */}
                <div
                    className={`absolute inset-0 backface-hidden ${isFlipped ? "pointer-events-auto" : "pointer-events-none"}`}
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <ProjectList dict={dict} lang={lang} onFlip={() => setIsFlipped(false)} />
                </div>
            </motion.div>
        </div>
    );
}

/**
 * CardContent Component (Front Face)
 * 
 * @param dict - Dictionary data.
 * @param onFlip - Handler to flip the card to the back.
 * @param hasProjects - Whether there are projects to show.
 */
function CardContent({ dict, onFlip, hasProjects }: { dict: Dictionary; onFlip: () => void; hasProjects: boolean }) {
    return (
        <div className="glass w-full h-full rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Flip Button */}
            {hasProjects && (
                <button
                    onClick={onFlip}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
                    aria-label="Flip Card"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            )}

            {/* Increased spacing (gap-12) as requested */}
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left h-full justify-center">
                {/* Avatar Placeholder / Image */}
                <div className="relative group shrink-0">
                    <div className="w-32 h-32 rounded-full glass flex items-center justify-center border-2 border-white/20 shadow-xl overflow-hidden relative z-10">
                        <Image
                            src="https://avatars.githubusercontent.com/u/1302654?v=4"
                            alt="Dow Ma"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                </div>

                <div className="flex-1 space-y-4 flex flex-col justify-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight">
                            {dict.profile.title}
                        </h1>
                        <p className="text-lg text-white/60 font-medium mt-1">
                            {dict.profile.role}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <Badge icon={Code2} text={dict.profile.badges.vibeCoding} />
                        <Badge icon={Terminal} text={dict.profile.badges.agenticAi} />
                        <Badge icon={MapPin} text={dict.profile.badges.digitalNomad} />
                    </div>

                    <p className="text-white/80 leading-relaxed text-lg max-w-lg">
                        {dict.profile.bio}
                    </p>

                    <div className="pt-4 flex gap-4 justify-center md:justify-start items-center flex-wrap">
                        <a
                            href="https://opc.land?ref=dow.ma"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all text-sm font-medium"
                        >
                            <span>{dict.profile.opcManual}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                        <div className="hidden md:block w-px h-6 bg-white/10 mx-2" />
                        <div className="flex gap-4">
                            <SocialLink href="https://x.com/VoiceOfDow" icon={XIcon} />
                            <SocialLink href="https://github.com/dow-ma" icon={Github} />
                            <SocialLink href="mailto:echo@dow.ma" icon={Mail} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * ProjectList Component (Back Face)
 */
function ProjectList({ dict, lang, onFlip }: { dict: Dictionary; lang: "en" | "zh"; onFlip: () => void }) {
    return (
        <div className="glass w-full h-full rounded-3xl p-8 relative overflow-hidden flex flex-col">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

            {/* Flip Button */}
            <button
                onClick={onFlip}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20 cursor-pointer"
                aria-label="Flip Back"
            >
                <RefreshCw className="w-5 h-5" />
            </button>

            <div className="relative z-10 h-full flex flex-col">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Layers className="w-8 h-8 text-indigo-400" />
                    {dict.projects.title}
                </h2>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2 min-h-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {validProjects.map((project, index) => {
                            const isGithub = project.url.includes("github.com");
                            const Icon = isGithub ? Github : LinkIcon;
                            const description = project.description;

                            return (
                                <a
                                    key={index}
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-row items-center justify-start p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all cursor-pointer min-h-[3.5rem] h-auto gap-2 relative z-10 overflow-hidden"
                                    title={description ? description[lang] : ""}
                                >
                                    <Icon className="w-4 h-4 text-white/70 group-hover:text-purple-300 transition-colors shrink-0" />
                                    <span className="text-xs font-medium text-white/90 group-hover:text-white break-words leading-tight text-left">
                                        {project.name}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Badge Component
 */
function Badge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors">
            <Icon className="w-3.5 h-3.5" />
            <span>{text}</span>
        </div>
    );
}

/**
 * SocialLink Component
 */
function SocialLink({ href, icon: Icon }: { href: string; icon: React.ElementType }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all transform hover:scale-110"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
