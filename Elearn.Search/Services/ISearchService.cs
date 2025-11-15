namespace Elearn.Search.Services
{
    public interface ISearchService
    {
        Task EnsureIndexAsync(string? index = null, CancellationToken cancellationToken = default);
        Task IndexAsync<T>(T document, string? index = null) where T : class;
        Task<T?> GetAsync<T>(string id, string? index = null) where T : class;
        Task<IEnumerable<T>> SearchAsync<T>(string query, string? index = null, bool onlyPublished = true) where T : class;
        Task DeleteAsync(string id, string? index = null);
        Task<IEnumerable<string>> AutocompleteAsync(string prefix, string? index = null, int size = 10, bool onlyPublished = true, CancellationToken cancellationToken = default);
    }
}


