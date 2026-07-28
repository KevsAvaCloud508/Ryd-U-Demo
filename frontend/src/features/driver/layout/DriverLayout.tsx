import { Outlet } from 'react-router-dom';

import { DriverSidebar } from '../components/DriverSidebar';

export function DriverLayout() {
  return (
    <div className="flex min-h-screen bg-black">
      <DriverSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
