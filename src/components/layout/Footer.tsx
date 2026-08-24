import { useLocale } from '@/hooks/useLocale'
import { SITE } from '@/lib/constants'

export function Footer() {
  const { ui } = useLocale()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-gutter py-10 font-mono text-meta text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. {ui.footer.rights}
        </p>
        <p>{ui.footer.builtWith}</p>
      </div>
    </footer>
  )
}
