using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Elearn.Domain.Entities.Identity
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<ApplicationRolePermission> RolePermissions { get; set; } = new List<ApplicationRolePermission>();
    }
}

