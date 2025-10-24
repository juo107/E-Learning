import { create } from 'zustand';
import type { Course } from '../types/course';

type CartItem = { course: Course; qty: number };

type CartState = {
  items: Record<number, CartItem>;
  add: (course: Course, qty?: number) => void;
  remove: (courseId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  items: {},
  add: (course, qty = 1) => set(() => {
    const items = { ...get().items };
    const existing = items[course.id];
    items[course.id] = { course, qty: (existing?.qty ?? 0) + qty };
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
}));






















