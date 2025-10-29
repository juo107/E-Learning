 

export default function Terms() {
  const toc = [
    { id: 'scope', label: 'Phạm vi & Chấp nhận' },
    { id: 'accounts', label: 'Tài khoản & Bảo mật' },
    { id: 'payments', label: 'Thanh toán & Hoàn tiền' },
    { id: 'ip', label: 'Sở hữu trí tuệ' },
    { id: 'conduct', label: 'Hành vi bị cấm' },
    { id: 'termination', label: 'Đình chỉ & Chấm dứt' },
    { id: 'liability', label: 'Trách nhiệm & Bảo đảm' },
    { id: 'law', label: 'Luật áp dụng' },
    { id: 'contact', label: 'Liên hệ pháp lý' },
  ]

  return (
    <section className="relative w-full px-4 py-10">
      {/* background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400"/>
        <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-15 bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500"/>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 tracking-wide mb-3">
              Cập nhật: 01/11/2025
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Điều khoản dịch vụ</h1>
            <p className="mt-2 text-gray-400">Vui lòng đọc kỹ các điều khoản trước khi sử dụng nền tảng.</p>
          </header>

          {toc.map(s => (
            <section id={s.id} key={s.id} className="mb-6 scroll-mt-20">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold text-gray-100 mb-2">{s.label}</h2>
                <p className="text-gray-400 leading-relaxed">Nội dung chi tiết mục “{s.label}”. Bạn có thể thay thế/điền đầy đủ theo chính sách pháp lý của tổ chức.</p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-400">
                  <li>Điểm quan trọng 1.</li>
                  <li>Điểm quan trọng 2.</li>
                  <li>Điểm quan trọng 3.</li>
                </ul>
              </div>
            </section>
          ))}
        </div>
    </section>
  )
}


