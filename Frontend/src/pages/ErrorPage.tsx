import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError() as any
  const isResponse = isRouteErrorResponse(error)
  // Nếu không có error (trường hợp dùng như element cho route '*'), coi như 404
  const status = error ? (isResponse ? error.status : 500) : 404
  const statusText = error ? (isResponse ? error.statusText : 'Unexpected Error') : 'Not Found'
  const message = error
    ? ((isResponse ? error.data?.message : (error?.message || 'Đã xảy ra lỗi không mong muốn')) as string)
    : 'Trang bạn yêu cầu không tồn tại hoặc đã được di chuyển.'

  return (
    <section className="relative min-h-[80dvh] flex items-center justify-center overflow-hidden">
      {/* gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400"/>
        <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-15 bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500"/>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center px-6 animate-fade-in">
        {/* Large status code */}
        <div className="mb-2 text-[64px] md:text-[104px] leading-none font-black bg-gradient-to-r from-red-400 via-amber-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow">
          {status}
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 tracking-wide mb-6">
          <span className="mr-2 inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse"/>
          {statusText}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Có gì đó không đúng!
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {message}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-gray-100">
            Về trang chủ
          </Link>
          <button onClick={() => location.reload()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow hover:opacity-95">
            Tải lại trang
          </button>
        </div>
      </div>
    </section>
  )
}


