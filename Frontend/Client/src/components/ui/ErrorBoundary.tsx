import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

// ErrorBoundary đơn giản để bắt lỗi runtime và hiển thị fallback, đồng thời log ra console
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Ghi log chi tiết lỗi để dễ chẩn đoán
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ fontWeight: 600 }}>Đã có lỗi xảy ra</h1>
          <p>Vui lòng kiểm tra Console (F12) để xem thông tin chi tiết.</p>
        </div>
      );
    }
    return this.props.children;
  }
}


