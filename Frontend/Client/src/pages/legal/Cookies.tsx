 

function CookieTable() {
  const rows = [
    // ví dụ trống – điền theo thực tế triển khai
    // { name: '__host_sid', purpose: 'Phiên đăng nhập', type: 'Strictly necessary', ttl: 'Session', thirdParty: 'Không' },
  ] as Array<{ name: string; purpose: string; type: string; ttl: string; thirdParty: string }>

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5">
          <tr className="text-left text-gray-300">
            <th className="px-4 py-3">Tên cookie</th>
            <th className="px-4 py-3">Mục đích</th>
            <th className="px-4 py-3">Loại</th>
            <th className="px-4 py-3">TTL</th>
            <th className="px-4 py-3">Bên thứ ba</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-gray-400" colSpan={5}>Chưa có dữ liệu cookie. Vui lòng cập nhật sau.</td>
            </tr>
          ) : rows.map((r, idx) => (
            <tr key={r.name} className={idx % 2 ? 'bg-white/[0.03]' : ''}>
              <td className="px-4 py-3 text-gray-200">{r.name}</td>
              <td className="px-4 py-3 text-gray-400">{r.purpose}</td>
              <td className="px-4 py-3 text-gray-400">{r.type}</td>
              <td className="px-4 py-3 text-gray-400">{r.ttl}</td>
              <td className="px-4 py-3 text-gray-400">{r.thirdParty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Cookies() {

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
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Chính sách cookie</h1>
            <p className="mt-2 text-gray-400">Mô tả cách chúng tôi sử dụng cookies và công nghệ tương tự.</p>
          </header>

          <section id="intro" className="mb-6 scroll-mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Giới thiệu</h2>
              <p className="text-gray-400">Cookies giúp chúng tôi ghi nhớ phiên của bạn, tùy chỉnh trải nghiệm, đo lường hiệu suất và bảo mật tài khoản.</p>
            </div>
          </section>

          <section id="types" className="mb-6 scroll-mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Phân loại cookies</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li>Strictly necessary (bắt buộc cho hoạt động của trang).</li>
                <li>Functional (chức năng, cá nhân hóa).</li>
                <li>Performance/Analytics (hiệu suất, phân tích).</li>
                <li>Advertising/Targeting (quảng cáo, tiếp thị).</li>
              </ul>
            </div>
          </section>

          <section id="control" className="mb-6 scroll-mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Điều khiển & Tùy chọn</h2>
              <p className="text-gray-400">Bạn có thể quản lý consent trong trình duyệt hoặc tại phần Cài đặt cookie. Nút tùy chọn sẽ hiển thị tại footer nếu triển khai.</p>
              <div className="mt-3 flex items-center gap-3">
                <button className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-gray-200 text-sm">Chấp nhận tất cả</button>
                <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 text-sm">Tùy chỉnh</button>
              </div>
            </div>
          </section>

          <section id="details" className="mb-6 scroll-mt-20">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-gray-100 mb-3">Bảng chi tiết cookies</h2>
              <CookieTable />
            </div>
          </section>
      </div>
    </section>
  )
}


