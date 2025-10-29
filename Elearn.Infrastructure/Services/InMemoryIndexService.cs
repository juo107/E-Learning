using Microsoft.Extensions.Caching.Memory;

namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Triển khai dịch vụ index trong bộ nhớ (IMemoryCache).
    /// Lưu ý: chỉ lưu dữ liệu public, TTL ngắn; không lưu thông tin theo user.
    /// </summary>
    public class InMemoryIndexService : IInMemoryIndexService
    {
        private readonly IMemoryCache _cache;

        // TTL mặc định
        private static readonly TimeSpan DefaultShortTtl = TimeSpan.FromMinutes(10);
        private static readonly TimeSpan DefaultTreeTtl = TimeSpan.FromMinutes(15);

        public InMemoryIndexService(IMemoryCache cache)
        {
            _cache = cache;
        }

        // ========================= COURSE CODE INDEX =========================
        /// <summary>
        /// Sinh cache key cho mapping course code -> id.
        /// </summary>
        private static string CourseCodeKey(string code) => $"idx:course:code:{code}";
        private static string CourseTitleKey(string title) => $"idx:course:title:{title?.Trim().ToLower()}";

        /// <summary>
        /// Lấy nhanh courseId theo courseCode nếu có trong bộ nhớ; trả về null nếu miss.
        /// </summary>
        public Task<Guid?> GetCourseIdByCodeAsync(string courseCode, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(courseCode)) return Task.FromResult<Guid?>(null);
            if (_cache.TryGetValue(CourseCodeKey(courseCode), out Guid value))
            {
                return Task.FromResult<Guid?>(value);
            }
            return Task.FromResult<Guid?>(null);
        }

        /// <summary>
        /// Đặt/ghi nhớ mapping courseCode -> courseId vào bộ nhớ với TTL ngắn.
        /// </summary>
        public Task SetCourseCodeIndexAsync(string courseCode, Guid courseId, TimeSpan? ttl = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(courseCode)) return Task.CompletedTask;
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl ?? DefaultShortTtl,
                Size = 1
            };
            _cache.Set(CourseCodeKey(courseCode), courseId, options);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Xóa mapping courseCode -> courseId khỏi bộ nhớ (khi khóa học đổi mã/xóa).
        /// </summary>
        public Task InvalidateCourseCodeAsync(string courseCode, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(courseCode)) return Task.CompletedTask;
            _cache.Remove(CourseCodeKey(courseCode));
            return Task.CompletedTask;
        }

        // ========================= COURSE TITLE INDEX =========================
        /// <summary>
        /// Lấy danh sách courseId theo tiêu đề (title) chính xác trong bộ nhớ; null nếu miss.
        /// </summary>
        public Task<IReadOnlyList<Guid>?> GetCourseIdsByTitleAsync(string title, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(title)) return Task.FromResult<IReadOnlyList<Guid>?>(null);
            if (_cache.TryGetValue(CourseTitleKey(title), out List<Guid>? list) && list != null && list.Count > 0)
            {
                return Task.FromResult<IReadOnlyList<Guid>?>(list.AsReadOnly());
            }
            return Task.FromResult<IReadOnlyList<Guid>?>(null);
        }

        /// <summary>
        /// Thêm 1 courseId vào index theo title (không trùng lặp) với TTL ngắn.
        /// </summary>
        public Task AddCourseToTitleIndexAsync(string title, Guid courseId, TimeSpan? ttl = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(title)) return Task.CompletedTask;
            var key = CourseTitleKey(title);
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl ?? DefaultShortTtl,
                Size = 4
            };
            var list = _cache.Get<List<Guid>>(key) ?? new List<Guid>();
            if (!list.Contains(courseId))
            {
                list.Add(courseId);
            }
            _cache.Set(key, list, options);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Gỡ 1 courseId khỏi index theo title (khi đổi tên/xóa).
        /// </summary>
        public Task RemoveCourseFromTitleIndexAsync(string title, Guid courseId, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(title)) return Task.CompletedTask;
            var key = CourseTitleKey(title);
            var list = _cache.Get<List<Guid>>(key);
            if (list != null)
            {
                list.RemoveAll(id => id == courseId);
                if (list.Count == 0)
                {
                    _cache.Remove(key);
                }
                else
                {
                    _cache.Set(key, list, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = DefaultShortTtl,
                        Size = 4
                    });
                }
            }
            return Task.CompletedTask;
        }

        /// <summary>
        /// Xóa toàn bộ index theo title.
        /// </summary>
        public Task InvalidateCourseTitleAsync(string title, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(title)) return Task.CompletedTask;
            _cache.Remove(CourseTitleKey(title));
            return Task.CompletedTask;
        }

        // ========================= CATEGORY TREE / CHILDREN =========================
        /// <summary>
        /// Sinh cache key cho snapshot cây danh mục.
        /// </summary>
        private const string CategoryTreeKey = "idx:category:tree";

        /// <summary>
        /// Sinh cache key cho danh sách con theo parent.
        /// </summary>
        private static string CategoryChildrenKey(Guid parentId) => $"idx:category:{parentId}:children";

        /// <summary>
        /// Lấy snapshot cây danh mục (dùng cho menu/filter). Trả null nếu chưa có.
        /// </summary>
        public Task<object?> GetCategoryTreeSnapshotAsync(CancellationToken ct = default)
        {
            _cache.TryGetValue(CategoryTreeKey, out object? value);
            return Task.FromResult(value);
        }

        /// <summary>
        /// Lưu snapshot cây danh mục vào bộ nhớ với TTL.
        /// </summary>
        public Task SetCategoryTreeSnapshotAsync(object treeSnapshot, TimeSpan? ttl = null, CancellationToken ct = default)
        {
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl ?? DefaultTreeTtl,
                Size = 10
            };
            _cache.Set(CategoryTreeKey, treeSnapshot, options);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Xóa snapshot cây danh mục khỏi bộ nhớ (khi có thay đổi danh mục).
        /// </summary>
        public Task InvalidateCategoryTreeAsync(CancellationToken ct = default)
        {
            _cache.Remove(CategoryTreeKey);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Lấy danh sách con (children) của 1 category nếu có sẵn trong bộ nhớ; null nếu miss.
        /// </summary>
        public Task<IReadOnlyList<Guid>?> GetChildrenCategoriesAsync(Guid parentCategoryId, CancellationToken ct = default)
        {
            if (_cache.TryGetValue(CategoryChildrenKey(parentCategoryId), out IReadOnlyList<Guid>? list))
            {
                return Task.FromResult(list);
            }
            return Task.FromResult<IReadOnlyList<Guid>?>(null);
        }

        /// <summary>
        /// Lưu danh sách con (children) của 1 category vào bộ nhớ với TTL.
        /// </summary>
        public Task SetChildrenCategoriesAsync(Guid parentCategoryId, IReadOnlyList<Guid> childrenIds, TimeSpan? ttl = null, CancellationToken ct = default)
        {
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl ?? DefaultTreeTtl,
                Size = childrenIds?.Count ?? 1
            };
            _cache.Set(CategoryChildrenKey(parentCategoryId), childrenIds, options);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Xóa cache children theo parentCategoryId.
        /// </summary>
        public Task InvalidateChildrenCategoriesAsync(Guid parentCategoryId, CancellationToken ct = default)
        {
            _cache.Remove(CategoryChildrenKey(parentCategoryId));
            return Task.CompletedTask;
        }
    }
}


