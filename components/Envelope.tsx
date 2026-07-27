import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import envelopeVideo from "@/assets/ENVELOPE4.mp4";

interface EnvelopeProps {
  onOpen: () => void;
}

type Phase = "idle" | "playing" | "fading";

export function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenClick = () => {
    if (phase !== "idle") return;
    setPhase("playing");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        videoRef.current?.play();
      });
    });
  };

  const handleVideoEnded = () => {
    setPhase("fading");
    setTimeout(onOpen, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background">

      {/* ── Video — always mounted, plays fullscreen behind everything ── */}
      <video
        ref={videoRef}
        src={envelopeVideo}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={onOpen}
      />

      {/* ── Dark scrim over the video while idle so button reads clearly ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="scrim"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* ── Button — fades out when clicked ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="btn"
            className="absolute inset-x-0 bottom-14 flex justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              onClick={handleOpenClick}
              className="relative overflow-hidden rounded-full px-10 py-4 text-sm uppercase tracking-[0.3em] text-ivory cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 50%, oklch(0.62 0.09 78) 100%)",
                boxShadow: "0 8px 30px color-mix(in oklab, var(--gold) 40%, transparent)",
                fontFamily: "var(--font-sans)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 40px color-mix(in oklab, var(--gold) 50%, transparent)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer sweep */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
              <span className="relative z-10">Open Invitation</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-screen fade to black at the end ── */}
      <AnimatePresence>
        {phase === "fading" && (
          <motion.div
            key="fadeout"
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
