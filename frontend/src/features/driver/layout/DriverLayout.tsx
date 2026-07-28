import { Outlet } from 'react-router-dom';

import { DriverSidebar } from '../components/DriverSidebar';
import { VerificationProvider } from '../context/VerificationContext';

export function DriverLayout() {
  return (
    <VerificationProvider>
      <div className="flex min-h-screen bg-black">
        <DriverSidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </VerificationProvider>
  );
}
