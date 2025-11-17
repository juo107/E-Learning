import adminApi from './api';

export interface LectureContentDto {
  id: string;
  lectureId: string;
  blockType: string;
  dataJson: string;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLectureContentDto {
  lectureId: string;
  blockType: string;
  dataJson: string;
  orderIndex?: number;
}

export interface UpdateLectureContentDto {
  blockType?: string;
  dataJson?: string;
  orderIndex?: number;
}

export interface BlockOrderItem {
  blockId: string;
  orderIndex: number;
}

export interface ReorderBlocksDto {
  lectureId: string;
  blocks: BlockOrderItem[];
}

export interface UpdateBlockJsonDto {
  dataJson: string;
}

export const lectureContentService = {
  getByLectureId: async (lectureId: string) => {
    const res = await adminApi.get(`/AdminLectureContent/lecture/${lectureId}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await adminApi.get(`/AdminLectureContent/${id}`);
    return res.data;
  },

  create: async (data: CreateLectureContentDto) => {
    const res = await adminApi.post('/AdminLectureContent', data);
    return res.data;
  },

  update: async (id: string, data: UpdateLectureContentDto) => {
    const res = await adminApi.put(`/AdminLectureContent/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await adminApi.delete(`/AdminLectureContent/${id}`);
    return res.data;
  },

  restore: async (id: string) => {
    const res = await adminApi.post(`/AdminLectureContent/${id}/restore`);
    return res.data;
  },

  reorderBlocks: async (data: ReorderBlocksDto) => {
    const res = await adminApi.post('/AdminLectureContent/reorder', data);
    return res.data;
  },

  updateBlockJson: async (id: string, data: UpdateBlockJsonDto) => {
    const res = await adminApi.put(`/AdminLectureContent/${id}/json`, data);
    return res.data;
  },
};

