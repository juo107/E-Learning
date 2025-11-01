using Elearn.Domain.Entities.Enums.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string? AvatarUrl { get; set; }
        public SystemRole UserType { get; set; } = SystemRole.Student; 

        // Navigation
        public InstructorProfile? InstructorProfile { get; set; }
        public StudentProfile? StudentProfile { get; set; }
    }

}
