import { AlertTriangle, Terminal } from "lucide-react";
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
        <div className="wire-box my-10 overflow-hidden border-primary/50">
            <div className="wire-header bg-primary/10 border-primary/20 text-primary">
                <Terminal size={12} />
                <span>Status_Report / Translation_Layer</span>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-background">
                <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 shrink-0 text-primary animate-pulse" />
                    <p className="text-sm font-bold opacity-80 leading-relaxed max-w-md">
                        {isViewingOriginal
                            ? (lang === 'zh' ? "STATUS: READING_ORIGINAL_SOURCE" : "STATUS: READING_ORIGINAL_SOURCE")
                            : (lang === 'zh' ? "此文章已由 AI 自动翻译。如发现错误，欢迎指正。" : "This article has been automatically translated by AI. Please report any errors.")
                        }
                    </p>
                </div>

                <Link
                    href={toggleUrl}
                    className="wire-btn border-primary text-primary hover:bg-primary hover:text-white shrink-0 whitespace-nowrap"
                >
                    {isViewingOriginal ? `[ ${labels.viewTranslated} ]` : `[ ${labels.viewOriginal} ]`}
                </Link>
            </div>

            {/* Progress line decoration */}
            <div className="h-1 w-full bg-primary/5">
                <div className="h-full w-1/3 bg-primary/30" />
            </div>
        </div>
    );
}
