'use client';

import type confetti from 'canvas-confetti';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';

type ConfettiState = 'start' | 'running' | 'end';
type Palette = 'light' | 'medium' | 'strong';

type Particle =
  | { kind: 'circle'; x: number; y: number; radius: number; color: Palette }
  | {
      kind: 'capsule';
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      color: Palette;
    };

const FIGMA_SIZE = { width: 480, height: 140 };
const ANIMATION_TICKS = 36;
const DECAY = 0.92;

const PARTICLES: Particle[] = [
  { kind: 'circle', x: 44, y: 48, radius: 4, color: 'medium' },
  { kind: 'capsule', x: 72, y: 26, width: 4, height: 12, rotation: 30, color: 'strong' },
  { kind: 'circle', x: 107, y: 73, radius: 3, color: 'light' },
  { kind: 'capsule', x: 56.5, y: 98.4, width: 4, height: 10, rotation: -40, color: 'light' },
  { kind: 'circle', x: 135, y: 37, radius: 3, color: 'strong' },
  { kind: 'capsule', x: 100.8, y: 104.7, width: 4, height: 12, rotation: 60, color: 'medium' },
  { kind: 'circle', x: 422, y: 84, radius: 4, color: 'medium' },
  { kind: 'capsule', x: 392.7, y: 68.2, width: 4, height: 12, rotation: -30, color: 'strong' },
  { kind: 'circle', x: 379, y: 77, radius: 3, color: 'light' },
  { kind: 'capsule', x: 424.3, y: 103.1, width: 4, height: 10, rotation: 40, color: 'light' },
  { kind: 'circle', x: 347, y: 33, radius: 3, color: 'strong' },
  { kind: 'capsule', x: 378.2, y: 105.3, width: 4, height: 12, rotation: -60, color: 'medium' },
  { kind: 'circle', x: 208, y: 24, radius: 2, color: 'medium' },
  { kind: 'circle', x: 276, y: 22, radius: 2, color: 'strong' },
  { kind: 'capsule', x: 242, y: 12, width: 4, height: 8, rotation: -90, color: 'light' },
];

const COLOR_TOKENS: Record<Palette, { token: string; fallback: string }> = {
  light: { token: '--td-color-decoration-confetti-light', fallback: '#ffcdb6' },
  medium: { token: '--td-color-decoration-confetti-medium', fallback: '#ffa986' },
  strong: { token: '--td-color-decoration-confetti-strong', fallback: '#f76843' },
};

function getParticleColor(element: HTMLElement, palette: Palette) {
  const { token, fallback } = COLOR_TOKENS[palette];
  return getComputedStyle(element).getPropertyValue(token).trim() || fallback;
}

function createCapsuleShape(
  confettiFactory: typeof confetti,
  particle: Extract<Particle, { kind: 'capsule' }>,
): confetti.Shape {
  const { height, rotation, width } = particle;
  const capRadius = width / 2;
  const points: Array<{ x: number; y: number }> = [];
  const segments = 10;

  for (let index = 0; index <= segments; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI * index) / segments;
    points.push({
      x: width / 2 + capRadius * Math.cos(angle),
      y: capRadius + capRadius * Math.sin(angle),
    });
  }

  for (let index = 0; index <= segments; index += 1) {
    const angle = (Math.PI * index) / segments;
    points.push({
      x: width / 2 + capRadius * Math.cos(angle),
      y: height - capRadius + capRadius * Math.sin(angle),
    });
  }

  points.push({ x: 0, y: capRadius });

  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const path = points
    .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')
    .concat(' Z');

  // canvas-confetti 1.9.4 renders path matrices as six-value arrays; its types declare DOMMatrix.
  const matrix = [
    cos,
    sin,
    -sin,
    cos,
    -cos * (width / 2) + sin * (height / 2),
    -sin * (width / 2) - cos * (height / 2),
  ];

  return confettiFactory.shapeFromPath({
    path,
    matrix: matrix as unknown as DOMMatrix,
  });
}

function getMotionDistance(ticks: number, decay: number) {
  return (1 - decay ** ticks) / (1 - decay);
}

export interface ConfettiProps {
  /** 재생할지 여부. 기본값은 true입니다. */
  active?: boolean;
  /** 장식 영역에 추가할 클래스 이름 */
  className?: string;
}

/** 공용 confetti 애니메이션입니다. */
export function Confetti({ active = true, className }: ConfettiProps) {
  return (
    <ConfettiAnimation key={active ? 'active' : 'inactive'} active={active} className={className} />
  );
}

function ConfettiAnimation({ active, className }: { active: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<ConfettiState>('start');

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let emitter: ReturnType<typeof confetti.create> | undefined;

    async function animate() {
      try {
        const [module] = await Promise.all([
          import('canvas-confetti'),
          new Promise<void>((resolve) => window.setTimeout(resolve, 100)),
        ]);

        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) {
          setState('end');
          return;
        }

        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) {
          setState('end');
          return;
        }

        const confettiFactory = module.default;
        emitter = confettiFactory.create(canvas, {
          resize: true,
          useWorker: false,
          disableForReducedMotion: true,
        });
        const scale = rect.width / FIGMA_SIZE.width;
        const origin = { x: 0.5, y: 0.5 };
        const motionDistance = getMotionDistance(ANIMATION_TICKS, DECAY);
        const colors = {
          light: getParticleColor(canvas, 'light'),
          medium: getParticleColor(canvas, 'medium'),
          strong: getParticleColor(canvas, 'strong'),
        };

        setState('running');

        await Promise.all(
          PARTICLES.map((particle) => {
            const dx = (particle.x - FIGMA_SIZE.width / 2) * scale;
            const dy = (particle.y - FIGMA_SIZE.height / 2) * scale;
            const distance = Math.hypot(dx, dy);
            const color = colors[particle.color];
            const shape =
              particle.kind === 'circle' ? 'circle' : createCapsuleShape(confettiFactory, particle);
            const scalar =
              particle.kind === 'circle'
                ? (particle.radius * 2 * scale) / 6
                : (Math.max(particle.width, particle.height) * scale) / 10;

            return emitter?.({
              angle: (Math.atan2(-dy, dx) * 180) / Math.PI,
              colors: [color],
              decay: DECAY,
              disableForReducedMotion: true,
              flat: true,
              gravity: 0,
              origin,
              particleCount: 1,
              scalar,
              shapes: [shape],
              spread: 0,
              startVelocity: distance / motionDistance,
              ticks: ANIMATION_TICKS,
            });
          }),
        );

        if (!cancelled) setState('end');
      } catch {
        if (!cancelled) setState('end');
      }
    }

    void animate();

    return () => {
      cancelled = true;
      emitter?.reset();
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className={cn('relative block aspect-[24/7] w-full max-w-[480px] overflow-hidden', className)}
      data-slot="confetti"
      data-state={state}
    >
      <Image
        alt=""
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 h-full w-full object-fill transition-opacity duration-75',
          state === 'end' ? 'opacity-100' : 'opacity-0',
        )}
        height={FIGMA_SIZE.height}
        loading="eager"
        src="/images/confetti-end.svg"
        unoptimized
        width={FIGMA_SIZE.width}
      />
      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 h-full w-full transition-opacity duration-[600ms] ease-out motion-reduce:transition-none',
          state === 'running' ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
