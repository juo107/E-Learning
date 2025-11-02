import { create } from 'zustand';
import type { Course } from '../types/course';

type CartItem = { course: Course; qty: number };

type CartState = {
  items: Record<number, CartItem>;
  add: (course: Course, qty?: number) => void;
  update: (courseId: number, qty: number) => void;
  remove: (courseId: number) => void;
  clear: () => void;
  loadFromStorage: () => void;
};

// Load từ localStorage khi khởi tạo
const loadCartFromStorage = (): Record<number, CartItem> => {
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return {};
};

export const useCart = create<CartState>((set, get) => ({
  items: loadCartFromStorage(),
  
  add: (course, qty = 1) => set(() => {
    const items = { ...get().items };
    const courseId = (course as any).courseId ?? course.id;
    const existing = items[courseId];
    items[courseId] = { course, qty: (existing?.qty ?? 0) + qty };
    localStorage.setItem('cart', JSON.stringify(items));
    return { items };
  }),
  
  update: (courseId, qty) => set(() => {
    const items = { ...get().items };
    if (qty <= 0) {
      delete items[courseId];
    } else if (items[courseId]) {
      items[courseId] = { ...items[courseId], qty };
    }
    localStorage.setItem('cart', JSON.stringify(items));
    return { items };
  }),
  
  remove: (courseId) => set(() => {
    const items = { ...get().items };
    delete items[courseId];
    localStorage.setItem('cart', JSON.stringify(items));
    return { items };
  }),
  
  clear: () => set(() => {
    localStorage.removeItem('cart');
    return { items: {} };
  }),
  
  loadFromStorage: () => set(() => ({
    items: loadCartFromStorage(),
  })),
}));






















