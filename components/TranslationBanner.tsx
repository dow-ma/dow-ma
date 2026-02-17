import { AlertTriangle } from "lucide-react";

export function TranslationBanner({ lang }: { lang: "en" | "zh" }) {
    const isZh = lang === "zh";
    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg py-2 px-3 mb-6 flex items-center gap-2 text-yellow-500/90 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>
                {isZh
                    ? "此文章已由 AI 自动翻译。如发现错误，欢迎指正。"
                    : "This article has been automatically translated by AI. Please report any errors."}
            </p>
        </div>
    );
}
