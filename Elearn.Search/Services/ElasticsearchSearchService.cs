using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.IndexManagement;
using Elastic.Clients.Elasticsearch.Mapping;
using Elastic.Clients.Elasticsearch.Core.Search;
using Elastic.Transport;
using Elearn.Search.Options;
using Microsoft.Extensions.Options;

namespace Elearn.Search.Services
{
    public class ElasticsearchSearchService : ISearchService
    {
        private readonly ElasticsearchClient _client;
        private readonly string _defaultIndex;

        public ElasticsearchSearchService(IOptions<ElasticsearchOptions> options)
        {
            var opts = options.Value;
            var settings = new ElasticsearchClientSettings(new Uri(opts.Url))
                .DefaultFieldNameInferrer(p => p); // Use field names as-is

            if (!string.IsNullOrWhiteSpace(opts.Username) && !string.IsNullOrWhiteSpace(opts.Password))
            {
                settings = settings.Authentication(new BasicAuthentication(opts.Username, opts.Password));
            }

            if (!string.IsNullOrWhiteSpace(opts.DefaultIndex))
            {
                settings = settings.DefaultIndex(opts.DefaultIndex);
            }

            _client = new ElasticsearchClient(settings);
            _defaultIndex = string.IsNullOrWhiteSpace(opts.DefaultIndex) ? "courses" : opts.DefaultIndex;
        }

        public async Task EnsureIndexAsync(string? index = null, CancellationToken cancellationToken = default)
        {
            var idx = index ?? _defaultIndex;

            // Try ping cluster first to avoid throwing during startup when ES is down
            try
            {
                var ping = await _client.PingAsync(cancellationToken);
                if (!ping.IsValidResponse)
                {
                    return; // skip silently, initializer will log
                }
            }
            catch
            {
                return; // unreachable
            }

            var exists = await _client.Indices.ExistsAsync(idx, cancellationToken);
            if (exists.Exists)
            {
                return;
            }

            var create = await _client.Indices.CreateAsync(new CreateIndexRequest(idx)
            {
                Settings = new IndexSettings
                {
                    NumberOfShards = "1",
                    NumberOfReplicas = "1"
                },
                Mappings = new TypeMapping
                {
                    Properties = new Properties
                    {
                        { "title", new TextProperty() },
                        { "description", new TextProperty() },
                        { "courseCode", new KeywordProperty() },
                        { "title_suggest", new CompletionProperty() }
                    }
                }
            }, cancellationToken);

            if (!create.IsValidResponse)
            {
                throw new InvalidOperationException($"Failed to create index '{idx}': {create.DebugInformation}");
            }
        }

        public async Task IndexAsync<T>(T document, string? index = null) where T : class
        {
            var targetIndex = index ?? _defaultIndex;
            var response = await _client.IndexAsync(document, targetIndex);
            if (!response.IsValidResponse)
            {
                throw new InvalidOperationException($"Failed to index document: {response.DebugInformation}");
            }
        }

        public async Task<T?> GetAsync<T>(string id, string? index = null) where T : class
        {
            var targetIndex = index ?? _defaultIndex;
            var response = await _client.GetAsync<T>(new GetRequest(targetIndex, id));
            return response.Found ? response.Source : null;
        }

        public async Task<IEnumerable<T>> SearchAsync<T>(string query, string? index = null) where T : class
        {
            var targetIndex = index ?? _defaultIndex;
            var response = await _client.SearchAsync<T>(s => s
                .Indices(targetIndex)
                .Query(q => q
                    .QueryString(qs => qs.Query(query))));

            if (!response.IsValidResponse)
            {
                throw new InvalidOperationException($"Search failed: {response.DebugInformation}");
            }

            return response.Documents;
        }

        public async Task DeleteAsync(string id, string? index = null)
        {
            var targetIndex = index ?? _defaultIndex;
            var response = await _client.DeleteAsync(new DeleteRequest(targetIndex, id));
            if (!response.IsValidResponse)
            {
                throw new InvalidOperationException($"Failed to delete document: {response.DebugInformation}");
            }
        }

        public async Task<IEnumerable<string>> AutocompleteAsync(string prefix, string? index = null, int size = 10, CancellationToken cancellationToken = default)
        {
            var targetIndex = index ?? _defaultIndex;

            var response = await _client.SearchAsync<Models.CourseSearchDocument>(s => s
                .Indices(targetIndex)
                .Size(size)
                .Query(q => q.MatchPhrasePrefix(m => m
                    .Field("title")
                    .Query(prefix)
                ))
            );

            if (!response.IsValidResponse)
            {
                throw new InvalidOperationException($"Autocomplete failed: {response.DebugInformation}");
            }

            return response.Hits
                .Select(h => h.Source?.Title)
                .Where(t => !string.IsNullOrWhiteSpace(t))!
                .Distinct()
                .Take(size)
                .ToList()!;
        }
    }
}


