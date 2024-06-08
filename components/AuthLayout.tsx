import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AuthHeader from './AuthHeader';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-base-100">
      <div className="w-64 bg-base-200 text-base-content">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AuthHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-base-100">
          <div className="max-h-screen overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;