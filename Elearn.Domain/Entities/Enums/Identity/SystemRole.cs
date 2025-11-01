using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Enums.Identity
{
    public enum SystemRole
    {
        // Quyền cao nhất — quản lý toàn hệ thống
        SystemSuperAdmin = 1,

        // Quản lý một tenant hoặc tổ chức con
        TenantAdmin = 2,

        // Quản trị nội dung
        ContentAdmin = 3,

        // Giảng viên
        Instructor = 4,

        // Học viên
        Student = 5,

        // Nhân viên hỗ trợ / CSKH
        SupportStaff = 6,

        // Quản lý cộng đồng, blog, bình luận
        Moderator = 7
    }
}

