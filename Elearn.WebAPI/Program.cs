using Elearn.Application;
using Elearn.Application.Validations;
using Elearn.Infrastructure;
using Elearn.Infrastructure.Data;
using Elearn.Search;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ElearnDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Elearn.Infrastructure")
    ));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:5174",
                "https://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services
builder.Services.AddApplication();
builder.Services.AddControllers()
.AddFluentValidation(config =>
 {
     config.RegisterValidatorsFromAssemblyContaining<CreateCourseValidator>();
 });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Standardize ModelState invalid response -> ProblemDetails (RFC 7807)
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problemDetails = new ValidationProblemDetails(context.ModelState)
        {
            Type = "https://datatracker.ietf.org/doc/html/rfc9110#name-400-bad-request",
            Title = "Bad Request",
            Status = StatusCodes.Status400BadRequest,
            Instance = context.HttpContext.Request.Path
        };

        // attach traceId for correlation
        problemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;

        var result = new ObjectResult(problemDetails)
        {
            StatusCode = StatusCodes.Status400BadRequest
        };
        result.ContentTypes.Add("application/problem+json");
        return result;
    };
});

// Add Infrastructure Layer
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddAutoMapper(typeof(Elearn.Application.Mapping.MappingProfile));

// Add Search Layer (Elasticsearch)
builder.Services.AddSearch(builder.Configuration);


var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowFrontend");

// Global exception handling -> ProblemDetails
app.UseMiddleware<Elearn.WebAPI.Middlewares.GlobalExceptionMiddleware>();

app.UseAuthorization();
app.MapControllers();

app.Run();
