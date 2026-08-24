import { cn } from '@/lib/cn'

/**
 * Controla el ancho de lectura. Las secciones son de ancho completo; el aire
 * interior lo pone esto y solo esto.
 */
export function Container({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-gutter', className)}
      {...props}
    >
      {children}
    </div>
  )
}
