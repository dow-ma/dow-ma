import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function TranslationBanner({
    lang,
    isViewingOriginal,
    toggleUrl,
    labels
}: {
    lang: "en" | "zh";
    isViewingOriginal: boolean;
    toggleUrl: string;
    labels: { viewOriginal: string; viewTranslated: string };
}) {
    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-3 px-5 my-8 flex items-center justify-between gap-3 text-yellow-500/90 text-sm">
            <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>
                    {isViewingOriginal
                        ? (lang === 'zh' ? "正在阅读原文内容。" : "Viewing original content.")
                        : (lang === 'zh' ? "此文章已由 AI 自动翻译。如发现错误，欢迎指正。" : "This article has been automatically translated by AI. Please report any errors.")
                    }
                </p>
            </div>

            <Link
                href={toggleUrl}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 transition-all font-medium whitespace-nowrap"
            >
                {isViewingOriginal ? labels.viewTranslated : labels.viewOriginal}
            </Link>
        </div>
    );
}
