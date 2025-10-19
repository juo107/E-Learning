namespace Elearn.Search.Models
{
    public class CourseSearchDocument
    {
        public string Id { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public string? CategoryId { get; set; }

        // This property name matches the index mapping field "title_suggest"
        public string title_suggest => Title;
    }
}


