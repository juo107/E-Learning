using Microsoft.Extensions.Caching.Memory;

namespace Elearn.Infrastructure.Services
{
    /// <summary>
    /// Dịch vụ index trong bộ nhớ (in-memory) để tra cứu nhanh các mapping nóng.
    /// Ghi chú: Chỉ cache dữ liệu public, TTL ngắn; không lưu dữ liệu theo user.
    /// </summary>
    public interface IInMemoryIndexService
    {
        // ========================= COURSE CODE INDEX =========================
        /// <summary>
        /// Lấy nhanh courseId theo courseCode nếu có trong bộ nhớ; trả về null nếu miss.
        /// </summary>
        Task<Guid?> GetCourseIdByCodeAsync(string courseCode, CancellationToken ct = default);

        /// <summary>
        /// Đặt/ghi nhớ mapping courseCode -> courseId vào bộ nhớ với TTL ngắn.
        /// </summary>
        Task SetCourseCodeIndexAsync(string courseCode, Guid courseId, TimeSpan? ttl = null, CancellationToken ct = default);

        /// <summary>
        /// Xóa mapping courseCode -> courseId khỏi bộ nhớ (khi khóa học đổi mã/xóa).
        /// </summary>
        Task InvalidateCourseCodeAsync(string courseCode, CancellationToken ct = default);

        // ========================= COURSE TITLE INDEX =========================
        /// <summary>
        /// Lấy danh sách courseId theo tiêu đề (title) chính xác trong bộ nhớ; null nếu miss.
        /// Ghi chú: Title có thể trùng → trả về nhiều Id.
        /// </summary>
        Task<IReadOnlyList<Guid>?> GetCourseIdsByTitleAsync(string title, CancellationToken ct = default);

        /// <summary>
        /// Thêm 1 courseId vào index theo title (không trùng lặp) với TTL ngắn.
        /// </summary>
        Task AddCourseToTitleIndexAsync(string title, Guid courseId, TimeSpan? ttl = null, CancellationToken ct = default);

        /// <summary>
        /// Gỡ 1 courseId khỏi index theo title (khi đổi tên/xóa).
        /// </summary>
        Task RemoveCourseFromTitleIndexAsync(string title, Guid courseId, CancellationToken ct = default);

        /// <summary>
        /// Xóa toàn bộ index theo title.
        /// </summary>
        Task InvalidateCourseTitleAsync(string title, CancellationToken ct = default);

        // ========================= CATEGORY TREE / CHILDREN =========================
        /// <summary>
        /// Lấy snapshot cây danh mục (dùng cho menu/filter). Trả null nếu chưa có.
        /// </summary>
        Task<object?> GetCategoryTreeSnapshotAsync(CancellationToken ct = default);

        /// <summary>
        /// Lưu snapshot cây danh mục vào bộ nhớ với TTL.
        /// </summary>
        Task SetCategoryTreeSnapshotAsync(object treeSnapshot, TimeSpan? ttl = null, CancellationToken ct = default);

        /// <summary>
        /// Xóa snapshot cây danh mục khỏi bộ nhớ (khi có thay đổi danh mục).
        /// </summary>
        Task InvalidateCategoryTreeAsync(CancellationToken ct = default);

        /// <summary>
        /// Lấy danh sách con (children) của 1 category nếu có sẵn trong bộ nhớ; null nếu miss.
        /// </summary>
        Task<IReadOnlyList<Guid>?> GetChildrenCategoriesAsync(Guid parentCategoryId, CancellationToken ct = default);

        /// <summary>
        /// Lưu danh sách con (children) của 1 category vào bộ nhớ với TTL.
        /// </summary>
        Task SetChildrenCategoriesAsync(Guid parentCategoryId, IReadOnlyList<Guid> childrenIds, TimeSpan? ttl = null, CancellationToken ct = default);

        /// <summary>
        /// Xóa cache children theo parentCategoryId.
        /// </summary>
        Task InvalidateChildrenCategoriesAsync(Guid parentCategoryId, CancellationToken ct = default);
    }
}


