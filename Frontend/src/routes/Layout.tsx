import { Outlet } from 'react-router-dom';
import AppLayout from '../App';

export default function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}


