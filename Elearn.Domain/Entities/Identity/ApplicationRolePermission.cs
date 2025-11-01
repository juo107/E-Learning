using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Elearn.Domain.Entities.Identity
{
    public class ApplicationRolePermission
    {
        public string RoleId { get; set; } = default!;
        public ApplicationRole Role { get; set; } = default!;

        public Guid PermissionId { get; set; }
        public ApplicationPermission Permission { get; set; } = default!;
    }
}

