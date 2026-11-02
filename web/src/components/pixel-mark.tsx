import { cn } from '@/lib/utils';

const Patterns = {
  spark: ['00100', '01110', '11011', '01110', '00100'],
  compare: ['11011', '10001', '11111', '10001', '11011'],
  answer: ['10101', '01110', '11011', '01110', '10101'],
  report: ['11111', '10101', '11110', '10100', '10000'],
};

export type PixelPattern = keyof typeof Patterns;

export function PixelMark({
  pattern = 'spark',
  className,
}: {
  pattern?: PixelPattern;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 25 25"
      fill="currentColor"
      className={cn('size-9 shrink-0', className)}
      aria-hidden="true"
    >
      {Patterns[pattern].flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === '1' ? (
            <rect
              key={`${x}-${y}`}
              x={x * 5}
              y={y * 5}
              width="4.5"
              height="4.5"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
