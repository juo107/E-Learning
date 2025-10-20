using AutoMapper;
using Elearn.Domain.Entities;
using Elearn.Application.DTOs.Course;
using Elearn.Application.DTOs.Category;

namespace Elearn.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Course mappings - AutoMapper sẽ tự động map các property cùng tên
            CreateMap<Course, CourseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
            
            CreateMap<Course, CourseDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
            
            CreateMap<CreateCourseDto, Course>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CourseCode, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<UpdateCourseDto, Course>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CourseCode, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.DurationInMinutes, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // Category mappings - AutoMapper sẽ tự động map các property cùng tên
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.ParentCategoryName, opt => opt.MapFrom(src => src.ParentCategory != null ? src.ParentCategory.Name : null))
                .ForMember(dest => dest.SubCategoriesCount, opt => opt.MapFrom(src => src.SubCategories != null ? src.SubCategories.Count : 0))
                .ForMember(dest => dest.CoursesCount, opt => opt.MapFrom(src => src.Courses != null ? src.Courses.Count : 0));
                
            CreateMap<Category, CategoryDetailsDto>()
                .ForMember(dest => dest.ParentCategoryName, opt => opt.MapFrom(src => src.ParentCategory != null ? src.ParentCategory.Name : null))
                .ForMember(dest => dest.SubCategories, opt => opt.MapFrom(src => src.SubCategories))
                .ForMember(dest => dest.Courses, opt => opt.MapFrom(src => src.Courses));
            
            CreateMap<CreateCategoryDto, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Courses, opt => opt.Ignore())
                .ForMember(dest => dest.ParentCategory, opt => opt.Ignore())
                .ForMember(dest => dest.SubCategories, opt => opt.Ignore());

            CreateMap<UpdateCategoryDto, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Courses, opt => opt.Ignore())
                .ForMember(dest => dest.ParentCategory, opt => opt.Ignore())
                .ForMember(dest => dest.SubCategories, opt => opt.Ignore());
        }
    }
}
