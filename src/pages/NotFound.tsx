import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { useLocale } from '@/hooks/useLocale'

export default function NotFound() {
  const { ui, home } = useLocale()

  return (
    <main id="main" className="py-section">
      <Container>
        <p className="font-mono text-meta tracking-widest text-muted uppercase">
          404
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-section">
          {ui.notFound.title}
        </h1>
        <p className="mt-4 max-w-prose text-lead">{ui.notFound.body}</p>
        <ButtonLink to={home} variant="ghost" className="mt-8">
          {ui.notFound.back}
        </ButtonLink>
      </Container>
    </main>
  )
}
