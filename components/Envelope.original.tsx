import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface EnvelopeProps {
  onOpen: () => void;
}

// Gold particle burst
function GoldParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: Math.random() * 6 + 2,
        height: Math.random() * 6 + 2,
        backgroundColor: `hsl(${40 + Math.random() * 20}, 65%, ${58 + Math.random() * 18}%)`,
      }}
      initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.2, 0],
        y: [0, -60 - Math.random() * 80],
        x: [(Math.random() - 0.5) * 120],
        rotate: [0, 360],
      }}
      transition={{ delay, duration: 1.8, ease: "easeOut" }}
    />
  );
}

// Inline SVG floral accent for envelope corners
function FloralAccent({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6">
        <circle cx="60" cy="60" r="5" fill="var(--gold)" opacity="0.8" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + Math.cos(rad) * 18;
          const y = 60 + Math.sin(rad) * 18;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="7"
              ry="4"
              transform={`rotate(${angle}, ${x}, ${y})`}
              fill="var(--gold)"
              opacity={0.4 + i * 0.05}
            />
          );
        })}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + Math.cos(rad) * 32;
          const y = 60 + Math.sin(rad) * 32;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="10"
              ry="4"
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
              fill="var(--gold-soft)"
              opacity="0.3"
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 60 + Math.cos(angle) * 48;
          const y = 60 + Math.sin(angle) * 48;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill="var(--gold)" opacity="0.4" />
          );
        })}
      </g>
    </svg>
  );
}

export function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<
    "idle" | "breaking" | "opening" | "letter" | "done"
  >("idle");
  const [particles, setParticles] = useState(false);

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("breaking");
    setTimeout(() => setPhase("opening"), 600);
    setTimeout(() => setPhase("letter"), 1400);
    setTimeout(() => {
      setParticles(true);
      setPhase("done");
      setTimeout(onOpen, 1600);
    }, 2600);
  };

  const sealCracked = phase !== "idle";
  const flapOpen = phase === "opening" || phase === "letter" || phase === "done";
  const letterUp = phase === "letter" || phase === "done";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Gold particle burst */}
      {particles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <GoldParticle
              key={i}
              x={35 + Math.random() * 30}
              y={35 + Math.random() * 30}
              delay={i * 0.04}
            />
          ))}
        </div>
      )}

      <motion.div
        className="flex flex-col items-center gap-8 relative px-4"
        animate={phase === "done" ? { scale: 0.9, opacity: 0, y: -40 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* "You Are Invited" heading */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="script text-5xl text-gold">You Are Invited</p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
                To the wedding of
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Envelope ── */}
        <div
          className="relative"
          style={{ width: "min(340px, 90vw)", height: "min(240px, 63.5vw)" }}
        >
          {/* Envelope body */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, var(--envelope) 0%, var(--envelope-dark) 100%)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.10)",
            }}
            initial={{ y: 60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 120 }}
          >
            {/* Gold foil border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                border: "2px solid transparent",
                background:
                  "linear-gradient(var(--envelope), var(--envelope)) padding-box, linear-gradient(135deg, var(--gold), var(--gold-soft), var(--gold), oklch(0.62 0.09 78)) border-box",
              }}
            />

            {/* Inner border */}
            <div
              className="absolute inset-3 rounded-xl pointer-events-none"
              style={{
                border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)",
              }}
            />

            {/* V-fold crease lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 340 240"
              fill="none"
              preserveAspectRatio="none"
            >
              <line
                x1="0" y1="240" x2="170" y2="130"
                stroke="color-mix(in oklab, var(--gold) 20%, transparent)"
                strokeWidth="1"
              />
              <line
                x1="340" y1="240" x2="170" y2="130"
                stroke="color-mix(in oklab, var(--gold) 20%, transparent)"
                strokeWidth="1"
              />
            </svg>

            {/* Floral corners */}
            <FloralAccent className="absolute -top-4 -left-4 w-20 h-20 opacity-30" />
            <FloralAccent className="absolute -top-4 -right-4 w-20 h-20 opacity-30" />
            <FloralAccent className="absolute -bottom-4 -left-4 w-16 h-16 opacity-20" />
            <FloralAccent className="absolute -bottom-4 -right-4 w-16 h-16 opacity-20" />

            {/* Embossed initials */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <span
                className="font-display text-2xl font-light tracking-widest"
                style={{
                  color: "color-mix(in oklab, var(--gold) 40%, transparent)",
                }}
              >
                C · Q
              </span>
            </div>
          </motion.div>

          {/* Flap — rotates open */}
          <motion.div
            className="absolute left-0 right-0 top-0 overflow-hidden"
            style={{
              height: "54%",
              transformOrigin: "top center",
              zIndex: flapOpen ? 5 : 10,
            }}
            animate={{ rotateX: flapOpen ? -160 : 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <svg
              viewBox="0 0 340 130"
              fill="none"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--envelope)" />
                  <stop offset="100%" stopColor="var(--envelope-dark)" />
                </linearGradient>
              </defs>
              <path
                d="M0 0 L170 110 L340 0 Z"
                fill="url(#flapGrad)"
                stroke="color-mix(in oklab, var(--gold) 40%, transparent)"
                strokeWidth="1"
              />
              <path
                d="M6 0 L170 104 L334 0"
                fill="none"
                stroke="color-mix(in oklab, var(--gold) 20%, transparent)"
                strokeWidth="0.8"
              />
            </svg>
          </motion.div>

          {/* Wax seal */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "37%", zIndex: 20 }}
            animate={
              sealCracked
                ? {
                    scale: [1, 1.3, 0.8, 0],
                    opacity: [1, 1, 0.5, 0],
                    rotate: [0, -15, 10, -20],
                  }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center relative"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, var(--wax), oklch(0.22 0.06 22) 100%)",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.15)",
              }}
            >
              {/* Crack lines on break */}
              {sealCracked && (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 56 56"
                >
                  <line x1="28" y1="10" x2="28" y2="46" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <line x1="10" y1="28" x2="46" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  <line x1="16" y1="16" x2="40" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                </svg>
              )}
              <span
                className="script text-gold-soft z-10 select-none"
                style={{ fontSize: "1.1rem", lineHeight: 1 }}
              >
                C&amp;Q
              </span>
            </div>
          </motion.div>

          {/* Letter card sliding up */}
          <AnimatePresence>
            {letterUp && (
              <motion.div
                className="absolute left-4 right-4 rounded-xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, var(--card) 0%, var(--background) 100%)",
                  boxShadow: "0 -10px 30px color-mix(in oklab, var(--gold) 15%, transparent)",
                  zIndex: 30,
                }}
                initial={{ top: "25%", opacity: 0 }}
                animate={{ top: "-38%", opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
              >
                <div
                  className="p-6 text-center"
                  style={{
                    borderTop: "2px solid transparent",
                    borderImage:
                      "linear-gradient(90deg, transparent, var(--gold), transparent) 1",
                  }}
                >
                  <p className="script text-2xl text-gold mb-1">Together Forever</p>
                  <div className="gold-line w-16 mx-auto mb-2" />
                  <p className="font-serif text-sm italic text-foreground/70">
                    Calvin &amp; Querida
                  </p>
                  <p
                    className="mt-1 text-[0.65rem] tracking-widest uppercase text-gold"
                  >
                    06 · February · 2027
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA button */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                onClick={handleOpen}
                className="relative overflow-hidden px-10 py-4 rounded-full text-sm uppercase tracking-[0.3em] text-ivory cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 50%, oklch(0.62 0.09 78) 100%)",
                  boxShadow: "0 8px 30px color-mix(in oklab, var(--gold) 40%, transparent)",
                  fontFamily: "var(--font-sans)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 12px 40px color-mix(in oklab, var(--gold) 50%, transparent)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shimmer sweep */}
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />
                <span className="relative z-10">Open Invitation</span>
              </motion.button>

              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">
                Click to reveal your invitation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
