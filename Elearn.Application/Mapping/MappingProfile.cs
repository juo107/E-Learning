using AutoMapper;
using Elearn.Domain.Entities;
using Elearn.Application.DTOs.Course;

namespace Elearn.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Course, CourseDto>();
            CreateMap<CreateCourseDto, Course>();
        }
    }
}
