import { AlertTriangle } from "lucide-react";

export function TranslationBanner({ lang }: { lang: "en" | "zh" }) {
    const isZh = lang === "zh";
    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8 flex items-start gap-3 text-yellow-500/90 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
                {isZh
                    ? "此文章已由 AI 自动翻译。如发现错误，欢迎指正。"
                    : "This article has been automatically translated by AI. Please report any errors."}
            </p>
        </div>
    );
}
