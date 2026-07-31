"use client";
import { useEffect, useRef } from "react";
const cupid = "/cupid.png";
import "./FloatingCupid.css";

const CUPID_SIZE = 90;
const SPEED = 0.6;

export default function FloatingCupid() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    // Start moving in a random diagonal direction
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * SPEED;
    let vy = Math.sin(angle) * SPEED;

    function animate() {
      x += vx;
      y += vy;

      // Bounce off left/right edges
      if (x <= 0) { x = 0; vx = Math.abs(vx); }
      if (x >= window.innerWidth - CUPID_SIZE) { x = window.innerWidth - CUPID_SIZE; vx = -Math.abs(vx); }

      // Bounce off top/bottom edges
      if (y <= 0) { y = 0; vy = Math.abs(vy); }
      if (y >= window.innerHeight - CUPID_SIZE) { y = window.innerHeight - CUPID_SIZE; vy = -Math.abs(vy); }

      if (wrapperRef.current) {
        wrapperRef.current.style.left = `${x}px`;
        wrapperRef.current.style.top = `${y}px`;
      }

      frame = requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      x = Math.min(x, window.innerWidth - CUPID_SIZE);
      y = Math.min(y, window.innerHeight - CUPID_SIZE);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="floating-cupid-wrapper">
      <img src={cupid} alt="Cupid" className="floating-cupid" />
    </div>
  );
}