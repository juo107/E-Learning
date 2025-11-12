namespace Elearn.Application.DTOs.Cart
{
    /// <summary>
    /// DTO cho cart item
    /// </summary>
    public class CartItemDto
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public string? CourseThumbnailUrl { get; set; }
        public decimal PriceAtAdd { get; set; }
        public decimal CurrentPrice { get; set; }
        public string? AppliedCouponCode { get; set; }
        public DateTime AddedAt { get; set; }
    }
}

