'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SpinnerProps {
  /** Extra classes for the outer wrapper (e.g. “h-screen bg-black/40”). */
  className?: string;
  /** Extra classes for the spinner container (e.g. “w-32 h-32”). */
  classNameContainer?: string;
  /** Cover the entire viewport with a blurred overlay. */
  fullScreen?: boolean;
  /** Optional status text under the spinner. */
  message?: string;
}

/**
 * A silky-smooth loading indicator with:
 * – gradient-dashed ring + glow
 * – pulsing centre logo
 * – optional backdrop blur overlay
 */
export const LazyLoading = ({
  className,
  classNameContainer,
  fullScreen = true,
  message = 'Loading…',
}: SpinnerProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        fullScreen && 'fixed inset-0 z-[999] bg-background/60 backdrop-blur-sm',
        className,
      )}
    >
      {/* ─────────────────── Spinner ─────────────────── */}
      <div className={cn('relative size-40', classNameContainer)}>
        <svg
          className="absolute inset-0 animate-[spin_3s_linear_infinite]"
          viewBox="0 0 100 100"
        >
          {/* subtle glow behind the ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="black"
            strokeWidth="8"
            strokeOpacity="0.15"
            className="blur-md"
          />

          {/* dashed animated ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeDasharray="30 15"
            strokeLinecap="round"
            className="animate-[dash_2s_ease-in-out_infinite]"
          />
        </svg>

        {/* centre logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-[35%] animate-[pulse_2.5s_ease-in-out_infinite] drop-shadow-lg">
            <Image
              src="/assets/logo/loaderLogo.svg"
              alt="Loader logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* optional status text */}
      {message && (
        <p className="text-sm font-medium tracking-wide text-muted-foreground animate-[fade-in_0.8s_ease-in-out]">
          {message}
        </p>
      )}

      {/* ────────── Local keyframes (avoids Tailwind config edits) ────────── */}
      <style jsx>{`
        @keyframes dash {
          0%   { stroke-dashoffset: 0;   }
          100% { stroke-dashoffset: -180; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(0.25rem); }
          to   { opacity: 1; transform: translateY(0);        }
        }
      `}</style>
    </div>
  );
};
