using Elearn.Application.Common;
using Elearn.Application.DTOs.LectureContent;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminLectureContentController : BaseAdminController<AdminLectureContentController>
    {
        private readonly ILectureContentService _lectureContentService;

        public AdminLectureContentController(ILectureContentService lectureContentService, ILogger<AdminLectureContentController> logger)
            : base(logger)
        {
            _lectureContentService = lectureContentService;
        }

        #region GetByLectureId
        [HttpGet("lecture/{lectureId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<LectureContentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetByLectureId(Guid lectureId)
        {
            var result = await _lectureContentService.GetByLectureIdAsync(lectureId);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _lectureContentService.GetByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateLectureContentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<LectureContentDto>.Fail("Invalid model state"));
            }

            var result = await _lectureContentService.CreateAsync(dto);
            
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
            }
            
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLectureContentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<LectureContentDto>.Fail("Invalid model state"));
            }

            var result = await _lectureContentService.UpdateAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _lectureContentService.DeleteAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Restore
        [HttpPost("{id}/restore")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _lectureContentService.RestoreAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region ReorderBlocks
        [HttpPost("reorder")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ReorderBlocks([FromBody] ReorderBlocksDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<bool>.Fail("Invalid model state"));
            }

            var result = await _lectureContentService.ReorderBlocksAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region UpdateBlockJson
        [HttpPut("{id}/json")]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureContentDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateBlockJson(Guid id, [FromBody] UpdateBlockJsonDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<LectureContentDto>.Fail("Invalid model state"));
            }

            var result = await _lectureContentService.UpdateBlockJsonAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion
    }
}

