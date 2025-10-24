import { useEffect, useMemo, useState } from 'react';
import { adminApproveCourse, adminListCourses, adminRejectCourse, adminCreateCourse, adminUpdateCourse, adminDeleteCourse, adminGetCourseDetail, type AdminCourse, type AdminCourseDetail } from '../../services/admin';

export default function CoursesAdmin() {
  const [data, setData] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [published, setPublished] = useState<'all' | 'yes' | 'no'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [form, setForm] = useState<Partial<AdminCourse>>({ 
    title: '',
    shortDescription: '',
    category: '',
    slug: '',
    thumbnailUrl: '',
    price: undefined,
    discountPrice: undefined,
    currency: 'VND',
    isPublished: false,
    isFeatured: false,
    language: 'vi',
    level: 'Intermediate'
  });
  const [viewing, setViewing] = useState<AdminCourseDetail | null>(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminListCourses({ page, pageSize, search: search || undefined, isPublished: published === 'all' ? null : published === 'yes' });
      const rows = Array.isArray(res) ? res : (res as any).data ?? [];
      setData(rows);
    } catch (e: any) {
      setError(e?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, pageSize, search, published]);

  const total = useMemo(() => data.length, [data]);

  const onApprove = async (id: number) => {
    await adminApproveCourse(id); fetchData();
  };
  const onReject = async (id: number) => {
    await adminRejectCourse(id); fetchData();
  };

  const resetForm = () => {
    setForm({ title: '', shortDescription: '', category: '' });
    setEditing(null);
    setShowCreate(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await adminUpdateCourse(editing.courseId, form);
    } else {
      if (!form.title) return;
      await adminCreateCourse(form as any);
    }
    resetForm();
    fetchData();
  };

  const onDelete = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    await adminDeleteCourse(id);
    fetchData();
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Manage Courses</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
          <select value={published} onChange={(e) => setPublished(e.target.value as any)} className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <option value="all">All</option>
            <option value="yes">Published</option>
            <option value="no">Unpublished</option>
          </select>
          <button onClick={() => { setShowCreate(true); setEditing(null); setForm({ title: '', shortDescription: '', category: '' }); }} className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">New Course</button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2 pr-4">Students</th>
                <th className="py-2 pr-4">Published</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.courseId} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4">{c.courseId}</td>
                  <td className="py-2 pr-4 max-w-[340px] whitespace-nowrap overflow-hidden text-ellipsis">{c.title}</td>
                  <td className="py-2 pr-4">{c.category ?? '-'}</td>
                  <td className="py-2 pr-4">{c.averageRating ?? 0} ({c.ratingCount ?? 0})</td>
                  <td className="py-2 pr-4">{c.students ?? 0}</td>
                  <td className="py-2 pr-4">{c.isPublished ? 'Yes' : 'No'}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={async ()=> { const d = await adminGetCourseDetail(c.courseId); setViewing(d); }} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">View</button>
                      <button onClick={() => onApprove(c.courseId)} className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
                      <button onClick={() => onReject(c.courseId)} className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700">Reject</button>
                      <button onClick={() => { setEditing(c); setShowCreate(true); setForm({ title: c.title, shortDescription: c.shortDescription, category: c.category }); }} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">Edit</button>
                      <button onClick={() => onDelete(c.courseId)} className="px-2 py-1 rounded border border-rose-300 text-rose-600 hover:bg-rose-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button disabled={page<=1} onClick={() => setPage((p)=>Math.max(1,p-1))} className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800 disabled:opacity-50">Prev</button>
        <div className="text-sm text-gray-600 dark:text-gray-400">Page {page} • {total} items</div>
        <button onClick={() => setPage((p)=>p+1)} className="px-3 py-1 rounded border border-gray-200 dark:border-gray-800">Next</button>
      </div>

      {/* Create / Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">{editing ? 'Edit Course' : 'New Course'}</div>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-900">×</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input value={form.title ?? ''} onChange={(e)=>setForm(f=>({...f, title:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Slug</label>
                  <input value={form.slug ?? ''} onChange={(e)=>setForm(f=>({...f, slug:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Short description</label>
                  <textarea value={form.shortDescription ?? ''} onChange={(e)=>setForm(f=>({...f, shortDescription:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" rows={3} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <input value={form.category ?? ''} onChange={(e)=>setForm(f=>({...f, category:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Thumbnail URL</label>
                  <input value={form.thumbnailUrl ?? ''} onChange={(e)=>setForm(f=>({...f, thumbnailUrl:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Price (VND)</label>
                  <input type="number" min={0} value={form.price ?? ''} onChange={(e)=>setForm(f=>({...f, price: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Discount Price (VND)</label>
                  <input type="number" min={0} value={form.discountPrice ?? ''} onChange={(e)=>setForm(f=>({...f, discountPrice: e.target.value === '' ? undefined : Number(e.target.value)}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Currency</label>
                  <input value={form.currency ?? 'VND'} onChange={(e)=>setForm(f=>({...f, currency:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Language</label>
                  <select value={form.language ?? 'vi'} onChange={(e)=>setForm(f=>({...f, language:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <option value="vi">Vietnamese</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Level</label>
                  <select value={form.level ?? 'Intermediate'} onChange={(e)=>setForm(f=>({...f, level:e.target.value}))} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.isPublished} onChange={(e)=>setForm(f=>({...f, isPublished:e.target.checked}))} /> Published
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.isFeatured} onChange={(e)=>setForm(f=>({...f, isFeatured:e.target.checked}))} /> Featured
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">{editing ? 'Save changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setViewing(null)} />
          <div className="relative w-full max-w-4xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">📘</div>
                <div className="font-semibold text-lg truncate max-w-[560px]">{viewing.title}</div>
              </div>
              <button onClick={()=>setViewing(null)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/20">×</button>
            </div>
            
            {/* Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Meta badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${viewing.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                    {viewing.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                  {((viewing as any).isFeatured) && (
                    <span className="px-2.5 py-1 rounded-full text-xs bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300">Featured</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{viewing.level ?? '—'}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300">{viewing.language?.toUpperCase() ?? '—'}</span>
                </div>

                {/* Short description */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Short description</div>
                  <div className="text-gray-800 dark:text-gray-200">{viewing.shortDescription ?? '—'}</div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <div className="prose prose-sm dark:prose-invert max-h-56 overflow-y-auto scrollbar-none">
                    {(viewing as any).description ?? '—'}
                  </div>
                </div>

                {/* Lessons */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Lessons</div>
                  {viewing.lessons?.length ? (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden max-h-56 overflow-y-auto scrollbar-none">
                      {viewing.lessons.map(ls => (
                        <div key={ls.lessonId} className="flex items-center justify-between px-4 py-2 text-sm">
                          <div className="truncate mr-3">{ls.title}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{ls.durationSec ? Math.round(ls.durationSec/60) + 'm' : ''}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No lessons</div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-800">
                  {viewing.thumbnailUrl ? (
                    <img src={viewing.thumbnailUrl} alt={viewing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="text-sm text-gray-500">Pricing</div>
                  <div className="mt-1 text-2xl font-semibold">
                    {((viewing as any).effectivePrice ?? viewing.price ?? 0).toLocaleString('vi-VN')} {viewing.currency ?? 'VND'}
                  </div>
                  {(viewing as any).discountPrice ? (
                    <div className="text-xs text-gray-500">Sale: {((viewing as any).discountPrice).toLocaleString('vi-VN')} {viewing.currency ?? 'VND'}</div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                    <div className="text-gray-500">Category</div>
                    <div className="font-medium">{viewing.category ?? '—'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                    <div className="text-gray-500">Rating</div>
                    <div className="font-medium">{(viewing.averageRating ?? 0).toFixed(2)} ({viewing.ratingCount ?? 0})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2 bg-white/60 dark:bg-gray-950/60">
              <button onClick={()=>setViewing(null)} className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


