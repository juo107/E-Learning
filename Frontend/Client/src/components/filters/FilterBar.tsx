import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';

type Props = {
  categoryId?: string;
  categories?: Array<{ id: string; name: string }>;
  onCategoryChange?: (v: string) => void;
  level?: 'Beginner'|'Intermediate'|'Advanced'|'';
  onLevelChange?: (v: 'Beginner'|'Intermediate'|'Advanced'|'' ) => void;
  language?: 'Vi'|'En'|'';
  onLanguageChange?: (v: 'Vi'|'En'|'' ) => void;
  isPublished?: 'all'|'published'|'unpublished';
  onIsPublishedChange?: (v: 'all'|'published'|'unpublished') => void;
  minPrice?: number;
  onMinPriceChange?: (v: number) => void;
  maxPrice?: number;
  onMaxPriceChange?: (v: number) => void;
  minDuration?: number;
  onMinDurationChange?: (v: number) => void;
  maxDuration?: number;
  onMaxDurationChange?: (v: number) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  isDescending: boolean;
  onIsDescendingChange: (v: boolean) => void;
  onReset: () => void;
};

type FilterSection = 'ratings' | 'duration' | 'topic' | 'subcategory' | 'level' | 'language' | 'price' | 'practice' | 'subtitles';

export default function FilterBar({
  categoryId, categories, onCategoryChange, 
  level, onLevelChange, language, onLanguageChange, isPublished, onIsPublishedChange,
  minPrice, onMinPriceChange, maxPrice, onMaxPriceChange,
  minDuration, onMinDurationChange, maxDuration, onMaxDurationChange,
  sortBy, onSortByChange, isDescending, onIsDescendingChange, onReset,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<FilterSection>>(
    new Set(['ratings', 'duration'])
  );

  const toggleSection = (section: FilterSection) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const ratingOptions = [
    { value: 4.5, label: '4.5 & up', stars: 5, count: 702 },
    { value: 4.0, label: '4.0 & up', stars: 4, count: 1386 },
    { value: 3.5, label: '3.5 & up', stars: 3, count: 1584 },
    { value: 3.0, label: '3.0 & up', stars: 3, count: 1645 },
  ];

  const durationOptions = [
    { label: '0-1 Hour', value: '0-1', min: 0, max: 60, count: 401 },
    { label: '1-3 Hours', value: '1-3', min: 60, max: 180, count: 781 },
    { label: '3-6 Hours', value: '3-6', min: 180, max: 360, count: 396 },
    { label: '6-17 Hours', value: '6-17', min: 360, max: 1020, count: 292 },
  ];

  const getSelectedRating = () => {
    // This would need to be connected to actual rating filter state
    return undefined;
  };

  const handleRatingChange = (rating: number) => {
    // Implement rating filter logic
    console.log('Selected rating:', rating);
  };

  const isDurationSelected = (option: typeof durationOptions[0]) => {
    if (minDuration === undefined || maxDuration === undefined) return false;
    return minDuration <= option.min && maxDuration >= option.max;
  };

  const handleDurationToggle = (option: typeof durationOptions[0]) => {
    if (isDurationSelected(option)) {
      // Deselect - reset duration
      if (onMinDurationChange) onMinDurationChange(undefined as any);
      if (onMaxDurationChange) onMaxDurationChange(undefined as any);
    } else {
      // Select - set duration range
      if (onMinDurationChange) onMinDurationChange(option.min);
      if (onMaxDurationChange) onMaxDurationChange(option.max);
    }
  };

  const renderStars = (count: number, filled: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 pr-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <select
          value={`${sortBy}-${isDescending ? 'desc' : 'asc'}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            onSortByChange(sort);
            onIsDescendingChange(order === 'desc');
          }}
          className="text-sm border border-gray-200 dark:border-gray-800 rounded px-3 py-1.5 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        >
          <option value="createdAt-desc">Most Popular</option>
          <option value="createdAt-desc">Newest</option>
          <option value="title-asc">A-Z</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="durationInMinutes-asc">Duration: Shortest</option>
          <option value="durationInMinutes-desc">Duration: Longest</option>
        </select>
      </div>

      {/* Ratings Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('ratings')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Ratings
          {expandedSections.has('ratings') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('ratings') && (
          <div className="space-y-2">
            {ratingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded"
              >
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={getSelectedRating() === option.value}
                  onChange={() => handleRatingChange(option.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2 flex-1">
                  {renderStars(5, option.stars)}
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </div>
                <span className="text-sm text-gray-500">({option.count})</span>
              </label>
            ))}
            <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2">
              Show more <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Video Duration Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('duration')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Video Duration
          {expandedSections.has('duration') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('duration') && (
          <div className="space-y-2">
            {durationOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={isDurationSelected(option)}
                  onChange={() => handleDurationToggle(option)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{option.label}</span>
                <span className="text-sm text-gray-500">({option.count})</span>
              </label>
            ))}
            <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2">
              Show more <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Topic Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('topic')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Topic
          {expandedSections.has('topic') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('topic') && (
          <div className="space-y-2">
            {/* Topic options would go here */}
            <p className="text-sm text-gray-500">No topics available</p>
          </div>
        )}
      </div>

      {/* Subcategory Filter */}
      {categories && categories.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
          <button
            onClick={() => toggleSection('subcategory')}
            className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Subcategory
            {expandedSections.has('subcategory') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('subcategory') && (
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={categoryId === cat.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onCategoryChange?.(cat.id);
                      } else {
                        onCategoryChange?.('');
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('level')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Level
          {expandedSections.has('level') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('level') && (
          <div className="space-y-2">
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <label
                key={lvl}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={level === lvl}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onLevelChange?.(lvl as any);
                    } else {
                      onLevelChange?.('');
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lvl}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Language Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('language')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Language
          {expandedSections.has('language') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('language') && (
          <div className="space-y-2">
            {[
              { value: 'Vi', label: 'Tiếng Việt' },
              { value: 'En', label: 'English' },
            ].map((lang) => (
              <label
                key={lang.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={language === lang.value}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onLanguageChange?.(lang.value as any);
                    } else {
                      onLanguageChange?.('');
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lang.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Price
          {expandedSections.has('price') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('price') && (
          <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minPrice ?? ''}
          onChange={(e) => onMinPriceChange?.(Number(e.target.value) || 0)}
                placeholder="Min"
                className="w-full rounded border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400 text-sm"
        />
            </div>
            <div className="flex items-center gap-2">
        <input
          type="number"
          value={maxPrice ?? ''}
          onChange={(e) => onMaxPriceChange?.(Number(e.target.value) || 0)}
                placeholder="Max"
                className="w-full rounded border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400 text-sm"
        />
            </div>
          </div>
        )}
      </div>

      {/* Hands-on Practice Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('practice')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Hands-on Practice
          {expandedSections.has('practice') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('practice') && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded">
        <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">With Practice</span>
            </label>
          </div>
        )}
      </div>

      {/* Subtitles Filter */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
        <button
          onClick={() => toggleSection('subtitles')}
          className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Subtitles
          {expandedSections.has('subtitles') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('subtitles') && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-1 rounded">
        <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">With Subtitles</span>
            </label>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        Reset Filters
      </button>
    </aside>
  );
}
