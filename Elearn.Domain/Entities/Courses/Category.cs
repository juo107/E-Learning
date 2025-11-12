using System;
using System.Collections.Generic;

namespace Elearn.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // 🔹 Self-referencing relationship
        public Guid? ParentCategoryId { get; set; }
        public Category? ParentCategory { get; set; }

        public ICollection<Category>? SubCategories { get; set; }

        public ICollection<Course>? Courses { get; set; }
    }
}

