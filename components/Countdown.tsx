import { useEffect, useState } from "react";

const TARGET = new Date("2027-02-06T10:00:00Z").getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET - now);
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  const items = [
    { label: "Days",    value: days },
    { label: "Hours",   value: hours },
    { label: "Mins",    value: minutes },
    { label: "Secs",    value: seconds },
  ];

  return (
    /* Always 4 equal columns — no wrapping, no min-width that can overflow */
    <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 w-full max-w-lg mx-auto">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex flex-col items-center  bg-ivory/50 backdrop-blur-sm py-4 sm:py-5 md:py-6"
        >
          <span className="font-display tabular-nums leading-none text-3xl sm:text-4xl md:text-6xl"
                style={{ color: "#5B6142" }}>
            {String(it.value).padStart(2, "0")}
          </span>
          <span className="mt-2 tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[0.55rem] sm:text-[0.65rem] md:text-xs"
                style={{ color: "#5B6142" }}>
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}
