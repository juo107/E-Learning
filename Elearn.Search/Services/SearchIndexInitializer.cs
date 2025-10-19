using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elearn.Search.Services
{
    public class SearchIndexInitializer : IHostedService
    {
        private readonly ISearchService _searchService;
        private readonly ILogger<SearchIndexInitializer> _logger;

        public SearchIndexInitializer(ISearchService searchService, ILogger<SearchIndexInitializer> logger)
        {
            _searchService = searchService;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                await _searchService.EnsureIndexAsync(cancellationToken: cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Elasticsearch is unavailable. Skipping index initialization.");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}


