"use client";
import { useEffect, useRef } from "react";
const cupid = "/cupid.png";
import "./FloatingCupid.css";

const CUPID_SIZE = 90;

export default function FloatingCupid() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    let targetX = randomX();
    let targetY = randomY();
    let speed = randomSpeed();

    function randomX() { return CUPID_SIZE + Math.random() * (window.innerWidth - CUPID_SIZE * 2); }
    function randomY() { return CUPID_SIZE + Math.random() * (window.innerHeight - CUPID_SIZE * 2); }
    function randomSpeed() { return 0.4 + Math.random() * 0.5; }

    function chooseNewTarget() {
      // Pick a target on the opposite side of the screen for wide coverage
      const margin = CUPID_SIZE;
      targetX = margin + Math.random() * (window.innerWidth - margin * 2);
      targetY = margin + Math.random() * (window.innerHeight - margin * 2);
      speed = randomSpeed();
    }

    function animate() {
      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 40) chooseNewTarget();

      const angle = Math.atan2(dy, dx);
      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;

      x = Math.max(0, Math.min(window.innerWidth - CUPID_SIZE, x));
      y = Math.max(0, Math.min(window.innerHeight - CUPID_SIZE, y));

      if (wrapperRef.current) {
        wrapperRef.current.style.left = `${x}px`;
        wrapperRef.current.style.top = `${y}px`;
      }

      frame = requestAnimationFrame(animate);
    }

    animate();

    const wander = setInterval(chooseNewTarget, 6000);

    const resize = () => {
      x = Math.min(x, window.innerWidth - CUPID_SIZE);
      y = Math.min(y, window.innerHeight - CUPID_SIZE);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(wander);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="floating-cupid-wrapper">
      <img src={cupid} alt="Cupid" className="floating-cupid" />
    </div>
  );
}