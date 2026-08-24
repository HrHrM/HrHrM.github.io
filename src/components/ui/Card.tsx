import { cn } from '@/lib/cn'

/**
 * Contenedor de un pelo de borde. Sin sombra y sin fondo por defecto: en esta
 * dirección visual la separación la hace la línea, no el bloque de color.
 */
export function Card({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('border border-line', className)} {...props}>
      {children}
    </div>
  )
}
