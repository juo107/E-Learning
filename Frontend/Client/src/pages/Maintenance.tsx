export default function Maintenance() {
  return (
    <section className="relative min-h-[80dvh] flex items-center justify-center overflow-hidden">
      {/* background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400"/>
        <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500"/>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 animate-fade-in">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 tracking-wide mb-6">
          <span className="mr-2 inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
          Maintenance Mode
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Chúng tôi đang bảo trì để nâng cấp trải nghiệm
        </h1>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Hệ thống tạm thời không khả dụng trong thời gian ngắn. Chúng tôi đang triển khai các
          cải tiến về hiệu năng và độ ổn định. Cảm ơn bạn đã kiên nhẫn!
        </p>

        {/* Không hiển thị nút quay lại để đảm bảo chế độ bảo trì toàn trang */}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">Tình trạng</div>
            <div className="mt-1 font-semibold text-gray-100">Đang bảo trì</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">Ưu tiên</div>
            <div className="mt-1 font-semibold text-gray-100">Hiệu năng & Ổn định</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-gray-400">Thời gian dự kiến</div>
            <div className="mt-1 font-semibold text-gray-100">Ngắn (vui lòng đợi)</div>
          </div>
        </div>
      </div>
    </section>
  )
}


