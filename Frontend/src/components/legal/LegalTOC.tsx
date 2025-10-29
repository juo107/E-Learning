type Item = { id: string; label: string }

export default function LegalTOC({ items }: { items: Item[] }) {
  return (
    <nav aria-label="Table of contents" className="hidden lg:block sticky top-20 self-start w-64 shrink-0">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-gray-300 mb-3">Mục lục</div>
        <ul className="space-y-2 text-sm">
          {items.map(i => (
            <li key={i.id}>
              <a href={`#${i.id}`} className="text-gray-400 hover:text-gray-200">
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}


