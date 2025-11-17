import { CheckCircle2 } from 'lucide-react';

interface ModerationChecklistProps {
  checklist: Record<string, boolean>;
  onChecklistChange: (checklist: Record<string, boolean>) => void;
}

const checklistItems = [
  {
    id: 'no-copyright',
    label: 'Nội dung không vi phạm bản quyền',
  },
  {
    id: 'video-quality',
    label: 'Video rõ ràng, âm thanh tốt',
  },
  {
    id: 'has-resources',
    label: 'Có đủ tài liệu kèm theo',
  },
  {
    id: 'section-organization',
    label: 'Sắp xếp section hợp lý',
  },
  {
    id: 'no-spelling-errors',
    label: 'Không lỗi chính tả',
  },
  {
    id: 'no-empty-lectures',
    label: 'Không có bài giảng trống',
  },
  {
    id: 'quality-standard',
    label: 'Chuẩn chất lượng theo yêu cầu',
  },
];

export default function ModerationChecklist({
  checklist,
  onChecklistChange,
}: ModerationChecklistProps) {
  const handleToggle = (id: string) => {
    onChecklistChange({
      ...checklist,
      [id]: !checklist[id],
    });
  };

  const allChecked = checklistItems.every((item) => checklist[item.id]);
  const checkedCount = checklistItems.filter((item) => checklist[item.id]).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Moderation Checklist
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {checkedCount}/{checklistItems.length}
        </span>
      </div>
      <div className="space-y-3">
        {checklistItems.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={checklist[item.id] || false}
                onChange={() => handleToggle(item.id)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                  checklist[item.id]
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-500'
                }`}
              >
                {checklist[item.id] && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <span
              className={`text-sm flex-1 ${
                checklist[item.id]
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
      {allChecked && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ All checklist items completed
          </p>
        </div>
      )}
    </div>
  );
}

