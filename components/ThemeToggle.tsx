"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeToggleProps {
    variant?: "header" | "button";
}

export function ThemeToggle({ variant = "header" }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (variant === "button") {
        return (
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="wire-btn"
            >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                <span className="text-[11px] font-black uppercase text-foreground/80">
                    {theme === "dark" ? "Light" : "Dark"}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors group px-2 border-l border-border/20 h-full"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {theme === "dark" ? <Sun size={12} className="group-hover:rotate-45 transition-transform" /> : <Moon size={12} />}
            <span className="text-[9px] font-black uppercase tracking-tighter">
                {theme === "dark" ? "Light" : "Dark"}
            </span>
        </button>
    );
}
