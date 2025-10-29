 using System.Net;
 using System.Text.Json;
 using FluentValidation;
 using Microsoft.AspNetCore.Http;
 using Microsoft.AspNetCore.Mvc;
 using Microsoft.EntityFrameworkCore;
 using Microsoft.Extensions.Hosting;
 using Microsoft.Extensions.Logging;

namespace Elearn.WebAPI.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

         public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (OperationCanceledException)
            {
                // nếu request bị hủy bởi client/cancel token
                 context.Response.StatusCode = StatusCodes.Status499ClientClosedRequest; 
                // 499 không phải chuẩn HTTP, nhưng nhiều proxy/nginx sử dụng.
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, _logger);
            }
        }

         private static async Task HandleExceptionAsync(HttpContext httpContext, Exception exception, ILogger logger)
        {
             var statusCode = GetStatusCode(exception);

             var traceId = GetCorrelationId(httpContext) ?? httpContext.TraceIdentifier;
            logger.LogError(exception, "Unhandled exception. TraceId: {TraceId}", traceId);

            var problemDetails = new ProblemDetails
            {
                Type = GetProblemType(statusCode),
                Title = GetTitle(statusCode),
                Status = (int)statusCode,
                Detail = GetDetail(exception),
                Instance = httpContext.Request.Path
            };

            problemDetails.Extensions["traceId"] = traceId;

            if (exception is ValidationException validationEx)
            {
                problemDetails.Extensions["errors"] = validationEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key, 
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );
            }

             // Only expose detailed debug info in Development
             var env = httpContext.RequestServices.GetService(typeof(IHostEnvironment)) as IHostEnvironment;
             if (env?.IsDevelopment() == true)
             {
                 problemDetails.Extensions["debug"] = new
                 {
                     exception = exception.GetType().FullName,
                     message = exception.Message,
                     stackTrace = exception.StackTrace
                 };
             }

            httpContext.Response.ContentType = "application/problem+json";
            httpContext.Response.StatusCode = problemDetails.Status ?? (int)HttpStatusCode.InternalServerError;

            var json = JsonSerializer.Serialize(
                problemDetails,
                new JsonSerializerOptions 
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = false
                });

            await httpContext.Response.WriteAsync(json);
        }

         private static HttpStatusCode GetStatusCode(Exception ex) => ex switch
        {
            ValidationException => HttpStatusCode.BadRequest,
             JsonException => HttpStatusCode.BadRequest,
             BadHttpRequestException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            KeyNotFoundException => HttpStatusCode.NotFound,
             TaskCanceledException => HttpStatusCode.RequestTimeout,
             DbUpdateConcurrencyException => HttpStatusCode.Conflict,
             DbUpdateException => HttpStatusCode.Conflict,
            _ => HttpStatusCode.InternalServerError
        };

         private static string GetProblemType(HttpStatusCode status) => status switch
        {
            HttpStatusCode.BadRequest => "https://datatracker.ietf.org/doc/html/rfc9110#name-400-bad-request",
            HttpStatusCode.Unauthorized => "https://datatracker.ietf.org/doc/html/rfc9110#name-401-unauthorized",
            HttpStatusCode.NotFound => "https://datatracker.ietf.org/doc/html/rfc9110#name-404-not-found",
             HttpStatusCode.RequestTimeout => "https://datatracker.ietf.org/doc/html/rfc9110#name-408-request-timeout",
             HttpStatusCode.Conflict => "https://datatracker.ietf.org/doc/html/rfc9110#name-409-conflict",
            _ => "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1"
        };

         private static string GetTitle(HttpStatusCode status) => status switch
        {
            HttpStatusCode.BadRequest => "Bad Request",
            HttpStatusCode.Unauthorized => "Unauthorized",
            HttpStatusCode.NotFound => "Not Found",
             HttpStatusCode.RequestTimeout => "Request Timeout",
             HttpStatusCode.Conflict => "Conflict",
            _ => "Internal Server Error"
        };

         private static string GetDetail(Exception ex) => ex switch
        {
            ValidationException => "One or more validation errors occurred.",
             JsonException => "Malformed JSON request payload.",
             BadHttpRequestException => "Bad HTTP request.",
            UnauthorizedAccessException => "The request requires user authentication.",
            KeyNotFoundException => "The requested resource was not found.",
             TaskCanceledException => "The request timed out.",
             DbUpdateConcurrencyException => "A concurrency conflict occurred while saving data.",
             DbUpdateException => "A data conflict occurred while saving changes.",
            _ => "An unexpected error has occurred."
        };

         private static string? GetCorrelationId(HttpContext context)
         {
             if (context.Request.Headers.TryGetValue("x-correlation-id", out var cid))
             {
                 var value = cid.ToString();
                 if (!string.IsNullOrWhiteSpace(value)) return value;
             }
             if (context.Request.Headers.TryGetValue("traceparent", out var traceparent))
             {
                 return traceparent.ToString();
             }
             return null;
         }
    }
}
