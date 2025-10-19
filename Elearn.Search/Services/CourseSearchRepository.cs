using Elearn.Search.Models;

namespace Elearn.Search.Services
{
    public interface ICourseSearchRepository
    {
        Task IndexAsync(CourseSearchDocument doc, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
        Task<IEnumerable<CourseSearchDocument>> SearchAsync(string keyword, int size = 20, CancellationToken cancellationToken = default);
        Task<IEnumerable<string>> AutocompleteAsync(string prefix, int size = 10, CancellationToken cancellationToken = default);
    }

    public class CourseSearchRepository : ICourseSearchRepository
    {
        private readonly ISearchService _searchService;
        private const string IndexName = "courses";

        public CourseSearchRepository(ISearchService searchService)
        {
            _searchService = searchService;
        }

        public async Task IndexAsync(CourseSearchDocument doc, CancellationToken cancellationToken = default)
        {
            await _searchService.IndexAsync(doc, IndexName);
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
        {
            try
            {
                await _searchService.DeleteAsync(id, IndexName);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<CourseSearchDocument>> SearchAsync(string keyword, int size = 20, CancellationToken cancellationToken = default)
        {
            var results = await _searchService.SearchAsync<CourseSearchDocument>(keyword, IndexName);
            return results.Take(size);
        }

        public async Task<IEnumerable<string>> AutocompleteAsync(string prefix, int size = 10, CancellationToken cancellationToken = default)
        {
            return await _searchService.AutocompleteAsync(prefix, IndexName, size, cancellationToken);
        }
    }
}


