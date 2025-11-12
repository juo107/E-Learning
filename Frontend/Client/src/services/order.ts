import api from './api';

export type OrderItemDto = {
  id: string;
  courseId: string;
  courseTitle: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
};

export type OrderDto = {
  id: string;
  orderCode: string;
  status: string;
  currency: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItemDto[];
};

export type CreateOrderDto = {
  courseIds: string[];
  couponCode?: string;
};

export type CreateOrderFromCartDto = {
  couponCode?: string;
};

/**
 * Tạo order từ danh sách course IDs (mua ngay)
 */
export async function createOrder(courseIds: string[], couponCode?: string): Promise<OrderDto> {
  try {
    const res = await api.post('/api/order/create', {
      courseIds,
      couponCode,
    } as CreateOrderDto);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to create order');
  }
}

/**
 * Tạo order từ giỏ hàng
 */
export async function createOrderFromCart(couponCode?: string): Promise<OrderDto> {
  try {
    const res = await api.post('/api/order/create-from-cart', {
      couponCode,
    } as CreateOrderFromCartDto);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to create order from cart');
  }
}

/**
 * Lấy order theo ID
 */
export async function getOrderById(orderId: string): Promise<OrderDto> {
  try {
    const res = await api.get(`/api/order/${orderId}`);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get order');
  }
}

/**
 * Lấy danh sách orders của user
 */
export async function getMyOrders(): Promise<OrderDto[]> {
  try {
    const res = await api.get('/api/order/my-orders');
    return res.data?.data ?? res.data ?? [];
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to get orders');
  }
}

