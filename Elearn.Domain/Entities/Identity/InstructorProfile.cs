using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Identity
{
    public class InstructorProfile
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        public string Bio { get; set; }
        public string Profession { get; set; }
        public double Rating { get; set; }

        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }

}
