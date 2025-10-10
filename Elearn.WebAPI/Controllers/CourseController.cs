using AutoMapper;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IMapper _mapper;

        public CourseController(ICourseService courseService, IMapper mapper)
        {
            _courseService = courseService;
            _mapper = mapper;
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            var course = _mapper.Map<Course>(dto);
            await _courseService.CreateCourseAsync(course);
            var result = _mapper.Map<CourseDto>(course);
            return CreatedAtAction(nameof(GetCourseById), new { id = result.Id }, result);
        }

        // READ ALL
        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            var result = _mapper.Map<IEnumerable<CourseDto>>(courses);
            return Ok(result);
        }

        // READ BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(Guid id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
                return NotFound();

            var result = _mapper.Map<CourseDto>(course);
            return Ok(result);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] CreateCourseDto dto)
        {
            var existing = await _courseService.GetCourseByIdAsync(id);
            if (existing == null)
                return NotFound();
            var updatedCourse = _mapper.Map<Course>(dto);
            updatedCourse.Id = id;
            await _courseService.UpdateCourseAsync(id, updatedCourse);
            var result = _mapper.Map<CourseDto>(existing);
            return Ok(result);
        }


        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
                return NotFound();

            await _courseService.DeleteCourseAsync(id);
            return NoContent();
        }
    }
}
