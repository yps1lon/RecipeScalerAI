import { useEffect, useState } from "react";

/**
 * LoadingTheatre
 * --------------
 * Manga-style throbber with rotating speed-lines, a breathing center icon,
 * and dramatic chef-judging copy that cycles every ~1.4s.
 *
 *   <LoadingTheatre />
 */

const PHASES: { copy: string; sub: string; icon: string }[] = [
    { copy: "The chef is tasting…",  sub: "Adjusting the salt.",        icon: "🥄" },
    { copy: "Plating up…",            sub: "Tweezers in hand.",          icon: "🍽" },
    { copy: "Reading the recipe…",    sub: "Word for word.",             icon: "📜" },
    { copy: "Doing the math…",        sub: "Scaling with reverence.",    icon: "✦" },
    { copy: "The judges are silent…", sub: "Anticipation builds.",       icon: "👁" },
    { copy: "Finishing touches…",     sub: "A whisper of citrus.",       icon: "🌿" },
];

export default function LoadingTheatre() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setPhase((p) => (p + 1) % PHASES.length);
        }, 1400);
        return () => clearInterval(id);
    }, []);

    const current = PHASES[phase];

    return (
        <div className="my-10 flex flex-col items-center justify-center text-center">
            {/* The throbber stage */}
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                {/* spinning speed lines (two layers, opposing directions) */}
                <div className="speed-lines" aria-hidden="true" />
                <div className="speed-lines cherry" aria-hidden="true" />

                {/* center disc */}
                <div
                    className="relative z-10 w-[120px] h-[120px] rounded-full panel flex items-center justify-center"
                    style={{ background: "var(--cream)" }}
                >
                    <div
                        className="halftone halftone-fade absolute inset-0 rounded-full pointer-events-none opacity-30"
                        aria-hidden="true"
                    />
                    <div className="breathe text-5xl relative z-10" key={current.icon} aria-hidden="true">
                        {current.icon}
                    </div>
                </div>

                {/* sparkle corners */}
                <span className="spark" style={{ top: 8, left: 8 }} />
                <span
                    className="spark"
                    style={{ bottom: 6, right: 4, animationDelay: "0.6s" }}
                />
            </div>

            {/* status copy — keyed so it re-fades on phase change */}
            <div key={phase} className="reveal-up mt-8 max-w-md">
                <div className="font-display text-2xl sm:text-3xl text-[color:var(--ink)] tracking-tight">
                    {current.copy}
                    <span className="dot-bob">.</span>
                    <span className="dot-bob d2">.</span>
                    <span className="dot-bob d3">.</span>
                </div>
                <div className="font-serif italic text-[color:var(--ink-soft)] mt-2 text-base sm:text-lg">
                    {current.sub}
                </div>
            </div>

            {/* small status row */}
            <div className="mt-6 flex items-center gap-3">
        <span className="stamp cherry blink" style={{ transform: "rotate(-3deg)" }}>
          ON THE PASS
        </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">
          please wait
        </span>
            </div>
        </div>
    );
}
