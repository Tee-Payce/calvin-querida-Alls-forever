"use client";
import { useEffect, useRef, useState } from "react";
const cupid = "/cupid.png";
const arrow = "/arrow.png";
import "./FloatingCupid.css";

interface Position {
  x: number;
  y: number;
}

interface Arrow {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const CUPID_SIZE = 90;

export default function FloatingCupid() {
  const [position, setPosition] = useState<Position>({ x: -200, y: -200 });
  const [rotation, setRotation] = useState(0);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const angleRef = useRef(0);

  useEffect(() => {
    let frame: number;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    function randomX() {
      return Math.random() * (window.innerWidth - CUPID_SIZE);
    }

    function randomY() {
      return Math.random() * (window.innerHeight - CUPID_SIZE);
    }

    function randomSpeed() {
      return 0.5 + Math.random() * 0.8;
    }

    let targetX = randomX();
    let targetY = randomY();
    let speed = randomSpeed();

    function chooseNewTarget() {
      targetX = randomX();
      targetY = randomY();
      speed = randomSpeed();
    }

    function animate() {
      const dx = targetX - x;
      const dy = targetY - y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        chooseNewTarget();
      }

      const angle = Math.atan2(dy, dx);
      angleRef.current = angle;

      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;

      x = Math.max(0, Math.min(window.innerWidth - CUPID_SIZE, x));
      y = Math.max(0, Math.min(window.innerHeight - CUPID_SIZE, y));

      setPosition({
        x,
        y,
      });

      setRotation((angle * 180) / Math.PI);

      frame = requestAnimationFrame(animate);
    }

    animate();

    // Occasionally change destination anyway
    const wander = setInterval(() => {
      chooseNewTarget();
    }, 5000);

    // Shoot arrows
    const arrowTimer = setInterval(() => {
      const id = Date.now();

      setArrows((prev) => [
        ...prev,
        {
          id,
          x: x + CUPID_SIZE / 2,
          y: y + CUPID_SIZE / 2,
          angle: angleRef.current,
        },
      ]);

      setTimeout(() => {
        setArrows((prev) => prev.filter((a) => a.id !== id));
      }, 3500);
    }, 8000 + Math.random() * 7000);

    const resize = () => {
      x = Math.min(x, window.innerWidth - CUPID_SIZE);
      y = Math.min(y, window.innerHeight - CUPID_SIZE);
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(wander);
      clearInterval(arrowTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div
        className="floating-cupid-wrapper"
        style={{ left: position.x, top: position.y, transform: `rotate(${rotation}deg)` }}
      >
        <img src={cupid} alt="Cupid" className="floating-cupid" />
      </div>

      {/* {arrows.map((arrow) => (
        <FlyingArrow key={arrow.id} {...arrow} />
      ))} */}
    </>
  );
}

interface FlyingArrowProps {
  x: number;
  y: number;
  angle: number;
}

function FlyingArrow({ x, y, angle }: FlyingArrowProps) {
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    let frame: number;

    let ax = x;
    let ay = y;

    const speed = 8;

    function animate() {
      ax += Math.cos(angle) * speed;
      ay += Math.sin(angle) * speed;

      setPos({
        x: ax,
        y: ay,
      });

      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(frame);
  }, [x, y, angle]);

  return (
    <img
      src={arrow as string}
      className="cupid-arrow"
      alt=""
      style={{
        left: pos.x,
        top: pos.y,
        transform: `rotate(${(angle * 180) / Math.PI}deg)`,
      }}
    />
  );
}