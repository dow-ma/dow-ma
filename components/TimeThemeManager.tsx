"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function TimeThemeManager() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            const isNight = hour >= 18 || hour < 6;
            const targetTheme = isNight ? "dark" : "light";

            const isManualOverride = localStorage.getItem("manual-theme-override") === "true";

            if (isManualOverride) {
                // If user's manual choice matches the current natural time-based theme,
                // we clear the override and resume auto-tracking.
                if (theme === targetTheme) {
                    localStorage.removeItem("manual-theme-override");
                }
                return;
            }

            if (theme !== targetTheme) {
                setTheme(targetTheme);
            }
        };

        checkTime();
        // Check every minute in case the hour flips while the page is open
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [theme, setTheme]);

    return null;
}
