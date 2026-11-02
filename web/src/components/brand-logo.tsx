import { cn } from '@/lib/utils';
import { useIsDarkTheme } from './theme-provider';

/** Shared product signature: magnifier, pixel pi, orange accents and two-tone name. */
export function BrandLogo({
  className,
  name = 'SourcePi AI',
}: {
  className?: string;
  name?: string;
}) {
  const dark = useIsDarkTheme();
  return (
    <span
      className={cn('aw-wordmark sourcepi-brand', className)}
      role="img"
      aria-label={name}
    >
      <img
        className="sourcepi-brand-icon"
        src={dark ? '/logo-dark.svg?v=sourcepi-pi' : '/logo.svg?v=sourcepi-pi'}
        alt=""
        aria-hidden="true"
      />
      <span className="sourcepi-brand-name" aria-hidden="true">
        {name === 'SourcePi AI' ? (
          <>
            SourcePi <span className="sourcepi-brand-ai">AI</span>
          </>
        ) : (
          name
        )}
      </span>
    </span>
  );
}
