import api from './api';

export type CartItemDto = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnailUrl?: string | null;
  priceAtAdd: number;
  currentPrice: number;
  appliedCouponCode?: string | null;
  addedAt: string;
};

export type AddToCartDto = {
  courseId: string;
  sessionId?: string;
};

/**
 * Thêm khóa học vào giỏ hàng
 */
export async function addToCart(courseId: string, sessionId?: string): Promise<CartItemDto> {
  try {
    const res = await api.post('/api/cart/add', {
      courseId,
      sessionId,
    } as AddToCartDto);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to add course to cart');
  }
}

/**
 * Lấy danh sách items trong giỏ hàng
 */
export async function getCartItems(): Promise<CartItemDto[]> {
  try {
    const res = await api.get('/api/cart');
    return res.data?.data ?? res.data ?? [];
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get cart items');
  }
}

/**
 * Xóa item khỏi giỏ hàng
 */
export async function removeFromCart(cartItemId: string): Promise<boolean> {
  try {
    const res = await api.delete(`/api/cart/${cartItemId}`);
    return res.data?.data ?? res.data ?? true;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to remove item from cart');
  }
}

/**
 * Xóa tất cả items trong giỏ hàng
 */
export async function clearCart(): Promise<boolean> {
  try {
    const res = await api.delete('/api/cart/clear');
    return res.data?.data ?? res.data ?? true;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to clear cart');
  }
}

