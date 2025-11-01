using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Application.Common
{
    public class QueryParameters
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 10;

        public int PageNumber { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string? Keyword { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool IsDescending { get; set; } = true;

        // Advanced filters
        public Guid? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinDurationInMinutes { get; set; }
        public int? MaxDurationInMinutes { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public bool OnlyPublished { get; set; } = false;
        public bool IncludeDeleted { get; set; } = false;
    }
}

