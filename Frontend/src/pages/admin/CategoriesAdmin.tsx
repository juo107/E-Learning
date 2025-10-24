import { useEffect, useState } from 'react';
import { adminCreateCategory, adminDeleteCategory, adminGetCategories, adminUpdateCategory, type AdminCategory } from '../../services/admin';

export default function CategoriesAdmin() {
  const [data, setData] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminGetCategories({ includeInactive: true });
      setData(Array.isArray(res) ? res : (res as any).data ?? []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onCreate = async () => {
    if (!name.trim()) return;
    await adminCreateCategory({ name, slug: slug || undefined });
    setName(''); setSlug('');
    fetchData();
  };

  const onToggle = async (c: AdminCategory) => {
    await adminUpdateCategory(c.id, { isActive: !c.isActive });
    fetchData();
  };

  const onDelete = async (c: AdminCategory) => {
    await adminDeleteCategory(c.id);
    fetchData();
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Manage Categories</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Category name" className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
        <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="slug (optional)" className="px-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" />
        <button onClick={onCreate} className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Create</button>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((c) => (
            <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-500">slug: {c.slug ?? '-'}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => onToggle(c)} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-800">{c.isActive ? 'Disable' : 'Enable'}</button>
                <button onClick={() => onDelete(c)} className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


