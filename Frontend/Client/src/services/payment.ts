import api from './api';

export type CreatePaymentDto = {
  orderId: string;
  paymentMethod: 'ATM' | 'QR' | 'INTL';
};

export type PaymentResponseDto = {
  id: string;
  orderId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  status: string;
};

/**
 * Tạo payment request và lấy VNPay payment URL
 */
export async function createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
  try {
    const res = await api.post('/api/payment/create', dto);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to create payment');
  }
}

