using Elearn.Domain.Entities.Identity;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Domain.Entities
{
    /// <summary>
    /// Bảng lưu thông tin khi người dùng mua khóa học
    /// Tạo bản ghi này khi thanh toán thành công
    /// </summary>
    public class UserCourse : BaseEntity
    {
        // Mã người dùng
        public string UserId { get; set; } = string.Empty;
        
        // Mã khóa học
        public Guid CourseId { get; set; }
        
        // Mã OrderItem (để trace back về đơn hàng)
        public Guid OrderItemId { get; set; }
        
        // Mã đơn hàng (để dễ dàng tra cứu)
        public Guid OrderId { get; set; }
        
        // Giá đã mua (lưu lại giá tại thời điểm mua)
        public decimal PurchasePrice { get; set; }
        
        // Ngày bắt đầu truy cập khóa học (thường là ngày thanh toán thành công)
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        
        // Ngày hết hạn truy cập (null = vĩnh viễn)
        public DateTime? ExpiresAt { get; set; }
        
        // Trạng thái: Active, Expired, Revoked, etc.
        public UserCourseStatus Status { get; set; } = UserCourseStatus.Active;
        
        // Tiến độ học tập (0-100%)
        public int ProgressPercent { get; set; } = 0;
        
        // Đã hoàn thành khóa học chưa
        public bool IsCompleted { get; set; } = false;
        
        // Ngày hoàn thành (nếu có)
        public DateTime? CompletedAt { get; set; }
        
        // Đánh giá của người dùng (1-5 sao, null = chưa đánh giá)
        public int? Rating { get; set; }
        
        // Nhận xét/Review của người dùng
        public string? Review { get; set; }
        
        // Ngày đánh giá
        public DateTime? ReviewedAt { get; set; }
        
        // Navigation properties
        public ApplicationUser? User { get; set; }
        public Course? Course { get; set; }
        public OrderItem? OrderItem { get; set; }
        public Order? Order { get; set; }
    }
}

