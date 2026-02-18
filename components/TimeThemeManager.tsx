"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function TimeThemeManager() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const checkTime = () => {
            // Only auto-switch if no manual theme is stored in localStorage 
            // OR if the user explicitly wants time-based switching to be active.
            // Usually, if a user hasn't interacted with the toggle, we follow the clock.

            const hasManualTheme = localStorage.getItem("theme") && localStorage.getItem("theme") !== "system";

            if (!hasManualTheme) {
                const hour = new Date().getHours();
                const isNight = hour >= 18 || hour < 6;
                const targetTheme = isNight ? "dark" : "light";

                if (theme !== targetTheme) {
                    setTheme(targetTheme);
                }
            }
        };

        checkTime();
        // Check every minute in case the hour flips while the page is open
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [theme, setTheme]);

    return null;
}
