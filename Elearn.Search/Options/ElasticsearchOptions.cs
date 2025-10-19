namespace Elearn.Search.Options
{
    public class ElasticsearchOptions
    {
        public string Url { get; set; } = string.Empty;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string DefaultIndex { get; set; } = "courses";
    }
}


