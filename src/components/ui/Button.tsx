import { Link } from 'react-router'

import { cn } from '@/lib/cn'

type Variant = 'solid' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-mono text-meta tracking-wide uppercase transition-colors duration-200 px-5 py-3'

const variants: Record<Variant, string> = {
  solid: 'bg-ink text-paper hover:bg-accent',
  ghost: 'border border-line text-ink hover:border-ink',
}

type CommonProps = {
  variant?: Variant
  className?: string
  children: React.ReactNode
}

/** Enlace interno. Usa el Link del router para no recargar la página. */
export function ButtonLink({
  to,
  variant = 'solid',
  className,
  children,
  ...props
}: CommonProps & { to: string } & Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    'to' | 'className' | 'children'
  >) {
  return (
    <Link to={to} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  )
}

/** Enlace externo o mailto. Siempre con rel de seguridad si abre pestaña. */
export function ButtonAnchor({
  href,
  variant = 'solid',
  external = false,
  className,
  children,
  ...props
}: CommonProps & {
  href: string
  external?: boolean
} & Omit<
    React.ComponentPropsWithoutRef<'a'>,
    'href' | 'className' | 'children'
  >) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}

export function Button({
  variant = 'solid',
  className,
  children,
  ...props
}: CommonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
