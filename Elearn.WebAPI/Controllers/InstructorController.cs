using Elearn.Application.Common;
using Elearn.Application.DTOs.Instructor;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController : BaseApiController<InstructorController>
    {
        private readonly IInstructorService _instructorService;

        public InstructorController(IInstructorService instructorService, ILogger<InstructorController> logger)
            : base(logger)
        {
            _instructorService = instructorService;
        }

        /// <summary>
        /// Lấy thông tin giảng viên theo ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<InstructorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<InstructorDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _instructorService.GetInstructorByIdAsync(id);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy thông tin giảng viên theo UserId
        /// </summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(BaseResponse<InstructorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<InstructorDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var result = await _instructorService.GetInstructorByUserIdAsync(userId);
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy danh sách khóa học của giảng viên
        /// </summary>
        [HttpGet("{id}/courses")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCourses(int id)
        {
            var result = await _instructorService.GetInstructorCoursesAsync(id);
            return HandleResponse(result);
        }
    }
}

