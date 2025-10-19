using Elearn.Application;
using Elearn.Application.Validations;
using Elearn.Infrastructure;
using Elearn.Infrastructure.Data;
using Elearn.Search;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ElearnDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Elearn.Infrastructure")
    ));

// Add services
builder.Services.AddApplication();
builder.Services.AddControllers()
.AddFluentValidation(config =>
 {
     config.RegisterValidatorsFromAssemblyContaining<CreateCourseValidator>();
 });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthorization();
app.MapControllers();

app.Run();
