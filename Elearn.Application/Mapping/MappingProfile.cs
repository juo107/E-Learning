using AutoMapper;
using Elearn.Domain.Entities;
using Elearn.Application.DTOs.Course;
using Elearn.Application.DTOs.Category;
using Elearn.Application.DTOs.CourseMedia;
using Elearn.Application.DTOs.Promotion;

namespace Elearn.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Course mappings - AutoMapper sẽ tự động map các property cùng tên
            CreateMap<Course, CourseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.ThumbnailUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary).MediaUrl 
                        : null
                    : null))
                .ForMember(dest => dest.PrimaryImageUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary).MediaUrl 
                        : null
                    : null))
                .ForMember(dest => dest.PromoVideoUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Video) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Video).MediaUrl 
                        : null
                    : null));
            
            CreateMap<Course, CourseDetailsDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.ThumbnailUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary).MediaUrl 
                        : null
                    : null))
                .ForMember(dest => dest.PrimaryImageUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Image && m.IsPrimary).MediaUrl 
                        : null
                    : null))
                .ForMember(dest => dest.PromoVideoUrl, opt => opt.MapFrom(src => src.CourseMedias != null && src.CourseMedias.Any() 
                    ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Video) != null 
                        ? src.CourseMedias.FirstOrDefault(m => m.MediaType == Domain.Entities.Enums.MediaType.Video).MediaUrl 
                        : null
                    : null));
            
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
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                // Avoid unintended reset when DTO omits these optional fields
                .ForMember(dest => dest.Level, opt => opt.Ignore())
                .ForMember(dest => dest.Language, opt => opt.Ignore())
                .ForMember(dest => dest.IsPublished, opt => opt.Ignore())
                .ForMember(dest => dest.PublishedAt, opt => opt.Ignore());

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

            // CourseMedia mappings - AutoMapper sẽ tự động map các property cùng tên
            CreateMap<CourseMedia, CourseMediaDto>();
            
            CreateMap<CreateCourseMediaDto, CourseMedia>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedBy, opt => opt.Ignore())
                .ForMember(dest => dest.Course, opt => opt.Ignore());

            CreateMap<UpdateCourseMediaDto, CourseMedia>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CourseId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedBy, opt => opt.Ignore())
                .ForMember(dest => dest.Course, opt => opt.Ignore());

            // Promotion mappings
            CreateMap<Promotion, PromotionDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.CourseIds, opt => opt.Ignore()); // CourseIds sẽ được map manually

            CreateMap<CreatePromotionDto, Promotion>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.UsageCount, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.PromotionCourses, opt => opt.Ignore());

            CreateMap<UpdatePromotionDto, Promotion>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.UsageCount, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.PromotionCourses, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
