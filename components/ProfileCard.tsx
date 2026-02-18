"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Code2, Terminal, Github, ArrowUpRight, Mail, RefreshCw, Layers, Link as LinkIcon, LucideIcon, User, Languages } from "lucide-react";
import { Dictionary, Project } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

import projectsDataRaw from "@/data/projects.json";

const projectsData = projectsDataRaw as Project[];
const validProjects = projectsData.filter(project => project.name && project.name.trim() !== "");

export function ProfileCard({ dict, lang }: { dict: Dictionary; lang: "en" | "zh" }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const hasProjects = validProjects.length > 0;

    return (
        <div className="w-full max-w-2xl h-[550px] md:h-[400px] perspective-1000 relative">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT FACE */}
                <div className={`absolute inset-0 backface-hidden h-full ${isFlipped ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"} transition-opacity duration-300`}>
                    <CardContent dict={dict} onFlip={() => setIsFlipped(true)} hasProjects={hasProjects} lang={lang} />
                </div>

                {/* BACK FACE */}
                <div className={`absolute inset-0 backface-hidden h-full ${isFlipped ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`} style={{ transform: "rotateY(180deg)" }}>
                    <ProjectList dict={dict} lang={lang} onFlip={() => setIsFlipped(false)} />
                </div>
            </motion.div>
        </div>
    );
}

function CardContent({ dict, onFlip, hasProjects, lang }: { dict: Dictionary; onFlip: () => void; hasProjects: boolean; lang: string }) {
    return (
        <div className="wire-box w-full h-full flex flex-col overflow-hidden">
            {/* Header with Relocated Toggles */}
            <div className="wire-header justify-between py-0 h-9">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-primary" />
                    <span className="text-[10px] font-black tracking-widest uppercase">MOCKUP / IDENTITY</span>
                </div>

                <div className="flex h-full items-center">
                    <ThemeToggle />
                    <Link
                        href={lang === 'en' ? '/zh' : '/en'}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors px-3 border-l border-border/20 h-full uppercase text-[9px] font-black tracking-tighter"
                    >
                        <Languages size={12} />
                        <span>{lang === 'en' ? '简体中文' : 'ENGLISH'}</span>
                    </Link>

                    {hasProjects && (
                        <button
                            onClick={onFlip}
                            className="text-[9px] font-black border-l border-border/50 px-4 hover:bg-primary hover:text-white transition-all h-full uppercase tracking-widest"
                        >
                            [ DATA ]
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 border-2 border-primary p-1 bg-background relative shadow-[4px_4px_0px_var(--primary)] group">
                        <div className="w-full h-full relative overflow-hidden bg-secondary">
                            <Image
                                src="https://avatars.githubusercontent.com/u/1302654?v=4"
                                alt="Dow Ma"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                priority
                            />
                        </div>
                        <div className="absolute -top-3 -left-3 text-primary font-black text-xl">+</div>
                        <div className="absolute -top-3 -right-3 text-primary font-black text-xl">+</div>
                        <div className="absolute -bottom-3 -left-3 text-primary font-black text-xl">+</div>
                        <div className="absolute -bottom-3 -right-3 text-primary font-black text-xl">+</div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left h-full flex flex-col justify-center">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-1 leading-none">
                            {dict.profile.title}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-primary font-bold text-xs uppercase opacity-80">
                            <span className="flex items-center gap-1"><Terminal size={12} /> {dict.profile.role}</span>
                            <span className="opacity-20">|</span>
                            <span>ST: ONLINE</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                        <Badge icon={Code2} text={dict.profile.badges.vibeCoding} />
                        <Badge icon={Terminal} text={dict.profile.badges.agenticAi} />
                        <Badge icon={MapPin} text={dict.profile.badges.digitalNomad} />
                    </div>

                    <p className="text-sm font-medium opacity-70 leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                        {dict.profile.bio}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start items-center">
                        <SocialButton href="https://opc.land?ref=dow.ma" label={dict.profile.opcManual} icon={ArrowUpRight} />
                        <SocialButton href="https://x.com/VoiceOfDow" label="X" icon={XIcon} />
                        <SocialButton href="https://github.com/dow-ma" label="Github" icon={Github} />
                        <SocialButton href="mailto:echo@dow.ma" label="Email" icon={Mail} />
                    </div>
                </div>
            </div>

            <div className="border-t border-primary/10 p-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-[8px] font-black uppercase opacity-40 bg-secondary/30">
                <div className="flex gap-1"><span>ID:</span> <span className="text-primary truncate">AID_01302654</span></div>
                <div className="flex gap-1"><span>LC:</span> <span className="text-primary truncate">ERTH_OFC</span></div>
                <div className="flex gap-1"><span>MM:</span> <span className="text-primary truncate">EXP_FRO</span></div>
                <div className="flex gap-1"><span>LV:</span> <span className="text-primary truncate">RT_ACC</span></div>
            </div>
        </div>
    );
}

function SocialButton({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="wire-btn py-1 px-3"
        >
            <span className="font-black text-[10px] uppercase">{label}</span>
            <Icon size={12} className="shrink-0" />
        </a>
    );
}

function ProjectList({ dict, lang, onFlip }: { dict: Dictionary; lang: "en" | "zh"; onFlip: () => void }) {
    return (
        <div className="wire-box w-full h-full flex flex-col overflow-hidden">
            <div className="wire-header justify-between py-0 h-9">
                <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    <span className="text-[10px] font-black tracking-widest uppercase">DATABASE / PROJECTS</span>
                </div>
                <button
                    onClick={onFlip}
                    className="text-[10px] font-black border-l border-border/50 px-4 hover:bg-primary hover:text-white transition-all h-full uppercase tracking-widest"
                >
                    [ RETURN ]
                </button>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    {validProjects.map((project, index) => {
                        const isGithub = project.url.includes("github.com");
                        const Icon = isGithub ? Github : LinkIcon;
                        return (
                            <a
                                key={index}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col border border-border/10 hover:border-primary transition-all bg-background shadow-[2px_2px_0px_transparent] hover:shadow-[3px_3px_0px_var(--primary)]"
                            >
                                <div className="p-2 border-b border-border/10 bg-secondary/30 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                                    <span className="text-[10px] font-black truncate pr-4">{project.name}</span>
                                    <Icon size={12} className="opacity-30 group-hover:opacity-100" />
                                </div>
                                <div className="p-3 text-[10px] font-medium opacity-60 line-clamp-2 h-12 overflow-hidden leading-tight">
                                    {project.description ? project.description[lang] : "..."}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

function Badge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
    return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-border/20 text-[9px] font-black text-foreground/50 hover:border-primary hover:text-primary transition-all uppercase">
            <Icon size={10} />
            <span>{text}</span>
        </div>
    );
}

function XIcon({ size }: { size: number }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width={size} height={size}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
