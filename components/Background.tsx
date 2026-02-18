"use client";

export function Background() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Scanline Effect */}
            <div className="scanline" />

            {/* Grit/Grid Effect */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Subtle glow in corners (simplified) */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[100px]" />
        </div>
    );
}
