import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 4 + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Corner flourishes */}
          <svg className="absolute top-6 left-6 w-20 h-20 opacity-30" viewBox="0 0 80 80" fill="none">
            <path d="M2 2 L2 30 Q2 2 30 2" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
            <path d="M2 2 L2 30" stroke="var(--gold)" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
            <circle cx="2" cy="2" r="2" fill="var(--gold)" />
            <path d="M10 2 Q20 2 20 12" stroke="var(--gold)" strokeWidth="0.8" fill="none" />
          </svg>
          <svg className="absolute top-6 right-6 w-20 h-20 opacity-30" viewBox="0 0 80 80" fill="none">
            <path d="M78 2 L78 30 Q78 2 50 2" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
            <circle cx="78" cy="2" r="2" fill="var(--gold)" />
          </svg>
          <svg className="absolute bottom-6 left-6 w-20 h-20 opacity-30" viewBox="0 0 80 80" fill="none">
            <path d="M2 78 L2 50 Q2 78 30 78" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
            <circle cx="2" cy="78" r="2" fill="var(--gold)" />
          </svg>
          <svg className="absolute bottom-6 right-6 w-20 h-20 opacity-30" viewBox="0 0 80 80" fill="none">
            <path d="M78 78 L78 50 Q78 78 50 78" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
            <circle cx="78" cy="78" r="2" fill="var(--gold)" />
          </svg>

          {/* Central content */}
          <div className="flex flex-col items-center gap-8">

            {/* Spinning rings + monogram */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-36 h-36 rounded-full"
                style={{ border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-28 h-28 rounded-full"
                style={{ border: "1px dashed color-mix(in oklab, var(--gold) 20%, transparent)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Gold disc */}
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 50%, oklch(0.62 0.09 78) 100%)",
                  boxShadow: "0 0 40px color-mix(in oklab, var(--gold) 40%, transparent), inset 0 1px 1px rgba(255,255,255,0.3)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="font-display text-ivory select-none font-semibold"
                  style={{ fontSize: "2.2rem", letterSpacing: "0.05em", textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  CQ
                </motion.span>
              </motion.div>

              {/* Orbiting dots */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--gold)",
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{ rotate: [angle, angle + 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "var(--gold)",
                      top: `-${Math.sin((angle * Math.PI) / 180) * 60 + 3}px`,
                      left: `${Math.cos((angle * Math.PI) / 180) * 60 - 3}px`,
                      opacity: 0.5 + i * 0.08,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Names */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <p className="italic text-4xl text-gold">Calvin &amp; Querida</p>
              <p
                className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground"
              >
                06 · February · 2027
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Loading
                </span>
                <span className="text-[10px] text-gold">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>
              <div
                className="h-px w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--gold), var(--gold-soft))",
                    width: `${Math.min(progress, 100)}%`,
                    boxShadow: "0 0 8px color-mix(in oklab, var(--gold) 60%, transparent)",
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
