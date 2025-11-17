using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elearn.Domain.Entities.Enums.Courses
{
   
        public enum ContentBlockType
        {
            Text,          // Đoạn văn
            Heading1,      // Tiêu đề lớn
            Heading2,      // Tiêu đề trung bình
            Heading3,      // Tiêu đề nhỏ
            Image,         // Ảnh
            Video,         // Video
            Quote,         // Trích dẫn
            Code,          // Mã code
            List,          // Danh sách bullet
            OrderedList,   // Danh sách sắp số
            Divider,       // Đường kẻ
            Html,          // HTML thô
            File           // File đính kèm (PDF, DOCX…)
        }
    

}
