using Elearn.Application;
using Elearn.Application.Validations;
using Elearn.Infrastructure;
using Elearn.Infrastructure.Data;
using Elearn.Search;
using Elearn.WebAPI.Middleware;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.AspNetCore.Identity;
using Elearn.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ElearnDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("WriteConnection"),
        b => b.MigrationsAssembly("Elearn.Infrastructure")
    ));
builder.Services.AddDbContext<ReadDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ReadConnection")
    );

    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

// Configure Identity
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false; // Có thể thay đổi sau
})
.AddEntityFrameworkStores<ElearnDbContext>()
.AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

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

// Add Response Caching
builder.Services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024 * 1024; // 1 MB
    options.UseCaseSensitivePaths = false; // Case-insensitive paths
    options.SizeLimit = 100 * 1024 * 1024; // 100 MB total cache size
});

// Add services
builder.Services.AddApplication();
builder.Services.AddControllers()
.AddFluentValidation(config =>
 {
     config.RegisterValidatorsFromAssemblyContaining<CreateCourseValidator>();
 })
.AddJsonOptions(options =>
{
    // Đảm bảo DateTime luôn được serialize như ISO 8601 UTC format với 'Z' suffix
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    // Format DateTime như ISO 8601 UTC
    options.JsonSerializerOptions.WriteIndented = false;
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

// Configure VNPay
builder.Services.Configure<Elearn.Application.Configurations.VNPayConfiguration>(
    builder.Configuration.GetSection(Elearn.Application.Configurations.VNPayConfiguration.SectionName));

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

// Use Response Caching (must be before UseAuthentication/UseAuthorization)
app.UseResponseCaching();

// Global exception handling -> ProblemDetails
app.UseMiddleware<Elearn.WebAPI.Middlewares.GlobalExceptionMiddleware>();

app.UseAuthentication();
// Check token blacklist before authorization
app.UseTokenBlacklist();
app.UseAuthorization();
app.MapControllers();

// Seed database với roles và admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await Elearn.Infrastructure.Identity.DbSeeder.SeedAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the database.");
    }
}

app.Run();
