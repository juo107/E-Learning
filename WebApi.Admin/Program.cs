using Elearn.Application;
using Elearn.Application.Validations;
using Elearn.Infrastructure;
using Elearn.Infrastructure.Data;
using Elearn.Search;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Elearn.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApi.Admin.Middlewares;

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
    options.SignIn.RequireConfirmedEmail = false;
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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin", "SystemSuperAdmin"));
    options.AddPolicy("SuperAdminOnly", policy => policy.RequireRole("SystemSuperAdmin"));
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAdminFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:5174",
                "https://localhost:5174",
                "http://localhost:5175",
                "https://localhost:5175"
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
app.UseCors("AllowAdminFrontend");

// Global exception handling
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
