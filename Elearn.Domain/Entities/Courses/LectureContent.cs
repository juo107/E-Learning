using Elearn.Domain.Entities.Enums.Courses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Courses
{
    
        public class LectureContent : BaseEntity
        {
            // Khóa ngoại liên kết với bảng Lecture
            public Guid LectureId { get; set; }

            // Điều hướng dữ liệu sang Lecture
            public Lecture? Lecture { get; set; }

            // Loại block (text, image, video, code...)
            public ContentBlockType BlockType { get; set; }

            // Dữ liệu chi tiết của block lưu dạng JSON
            public string DataJson { get; set; } = string.Empty;

            // Thứ tự hiển thị block trong bài giảng
            public int OrderIndex { get; set; }
        }
}
