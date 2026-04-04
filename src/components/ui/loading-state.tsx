"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  text?: string;
  size?: "sm" | "default" | "lg";
}

const GRID = 8;
const TICK_MS = 150;

type Point = [number, number];

const DIRECTIONS: Point[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function nextDirection(snake: Point[], dir: Point): Point {
  const head = snake[0];
  const nx = (((head[0] + dir[0]) % GRID) + GRID) % GRID;
  const ny = (((head[1] + dir[1]) % GRID) + GRID) % GRID;

  const collides = snake.some(([sx, sy]) => sx === nx && sy === ny);
  if (!collides) return dir;

  for (const d of DIRECTIONS) {
    const cx = (((head[0] + d[0]) % GRID) + GRID) % GRID;
    const cy = (((head[1] + d[1]) % GRID) + GRID) % GRID;
    if (!snake.some(([sx, sy]) => sx === cx && sy === cy)) return d;
  }
  return dir;
}

export function LoadingState({
  className,
  text = "Carregando...",
  size = "default",
}: LoadingStateProps) {
  const [snake, setSnake] = useState<Point[]>([
    [3, 3],
    [2, 3],
    [1, 3],
    [0, 3],
  ]);
  const dirRef = useRef<Point>([1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const d = nextDirection(prev, dirRef.current);
        dirRef.current = d;

        const head = prev[0];
        const nx = (((head[0] + d[0]) % GRID) + GRID) % GRID;
        const ny = (((head[1] + d[1]) % GRID) + GRID) % GRID;

        return [[nx, ny] as Point, ...prev.slice(0, -1)];
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const turnInterval = setInterval(() => {
      const prev = dirRef.current;
      const perpendicular = DIRECTIONS.filter(
        (d) =>
          !(d[0] === prev[0] && d[1] === prev[1]) &&
          !(d[0] === -prev[0] && d[1] === -prev[1])
      );
      dirRef.current =
        perpendicular[Math.floor(Math.random() * perpendicular.length)];
    }, TICK_MS * 5);
    return () => clearInterval(turnInterval);
  }, []);

  const cellSize = size === "sm" ? 4 : size === "lg" ? 8 : 6;
  const gap = size === "sm" ? 1 : 2;
  const gridPx = GRID * (cellSize + gap) - gap;

  const textSizeMap = {
    sm: "text-[8px]",
    default: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div style={{ width: gridPx, height: gridPx }} className="relative">
        {snake.map(([x, y], i) => {
          const opacity = Math.round((1 - (i / snake.length) * 0.6) * 100);
          return (
            <div
              key={i}
              className="absolute transition-all"
              style={{
                width: cellSize,
                height: cellSize,
                left: x * (cellSize + gap),
                top: y * (cellSize + gap),
                backgroundColor:
                  i === 0
                    ? "var(--primary)"
                    : `color-mix(in srgb, var(--primary) ${opacity}%, transparent)`,
                transitionDuration: `${TICK_MS}ms`,
              }}
            />
          );
        })}
      </div>
      {text && (
        <p
          className={cn(
            "font-pixel uppercase tracking-widest text-primary-dim",
            textSizeMap[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
