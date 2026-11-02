import { cn } from '@/lib/utils';

/** Scrollable page surface with the shared responsive page spacing. */
export function PageContainer({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('aw-page size-full overflow-auto', className)}
      {...props}
    />
  );
}
