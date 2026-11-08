impoimportortortrtortort React, { Suspense, lazy } from 'react';
iimportortmportort { BrowserRouter, Routes, Route, NavigateNavigate } from 'react-router-dom';
import UserPortal from './pages/UserPortal';

// Completely isolated, lazy-loaded Admin Page module
const AdminPage = lazy(() => import('./pagpageses/AdminPage'));

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-sm font-bold text-slate-300">অ্যাডমিন মডিউল লোড হচ্ছে...</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Marketplace Route */}
        <Route path="/" element={<UserPortal />} />
        
        {/* Dedicated Isolated Admin Route */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminPage />
            </Suspense>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
