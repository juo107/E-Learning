namespace Elearn.Domain.Entities.Enums
{
    public enum PromotionScope
    {
        All = 0,        // Áp dụng cho tất cả courses
        Category = 1,    // Áp dụng cho một category
        Course = 2,      // Áp dụng cho các courses cụ thể
        SpecificCourses = 3, // Danh sách courses cụ thể
    }
}

