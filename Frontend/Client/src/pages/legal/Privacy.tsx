 

export default function Privacy() {
  const toc = [
    { id: 'data-collected', label: 'Dữ liệu thu thập' },
    { id: 'purposes', label: 'Mục đích & Cơ sở pháp lý' },
    { id: 'retention', label: 'Lưu trữ & TTL' },
    { id: 'security', label: 'Biện pháp bảo mật' },
    { id: 'rights', label: 'Quyền của người dùng' },
    { id: 'sharing', label: 'Chia sẻ & Sub‑processors' },
    { id: 'transfer', label: 'Chuyển dữ liệu xuyên biên giới' },
    { id: 'children', label: 'Trẻ em' },
    { id: 'dpo', label: 'Liên hệ DPO' },
  ]

  return (
    <section className="relative w-full px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400"/>
        <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-15 bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500"/>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 tracking-wide mb-3">
              Cập nhật: 01/11/2025
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Chính sách bảo mật</h1>
            <p className="mt-2 text-gray-400">Chúng tôi cam kết bảo vệ dữ liệu cá nhân và quyền riêng tư của bạn.</p>
          </header>

          {toc.map(s => (
            <section id={s.id} key={s.id} className="mb-6 scroll-mt-20">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold text-gray-100 mb-2">{s.label}</h2>
                <p className="text-gray-400 leading-relaxed">Nội dung khung cho mục “{s.label}”. Vui lòng cập nhật theo thực tế xử lý dữ liệu và quy định hiện hành.</p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-400">
                  <li>Mô tả tổng quan.</li>
                  <li>Phạm vi áp dụng.</li>
                  <li>Liên kết tài liệu liên quan.</li>
                </ul>
              </div>
            </section>
          ))}
        </div>
    </section>
  )
}


