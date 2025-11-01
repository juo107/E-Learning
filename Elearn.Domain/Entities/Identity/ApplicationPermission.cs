using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Identity
{
    public class ApplicationPermission
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Ví dụ: "Permissions.Courses.View"
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;

        public string Module { get; set; } = default!; // Ví dụ: "Courses", "Categories"

        // Role liên kết (nếu muốn relationship nhiều-nhiều)
        public ICollection<ApplicationRolePermission> RolePermissions { get; set; } = new List<ApplicationRolePermission>();
    }
}

