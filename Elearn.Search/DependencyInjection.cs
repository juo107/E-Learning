using Elearn.Search.Options;
using Elearn.Search.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Elearn.Search
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSearch(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<ElasticsearchOptions>(configuration.GetSection("Elasticsearch"));
            services.AddSingleton<ISearchService, ElasticsearchSearchService>();
            services.AddSingleton<ICourseSearchRepository, CourseSearchRepository>();
            services.AddHostedService<SearchIndexInitializer>();
            return services;
        }
    }
}


