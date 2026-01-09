import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ConnectionStatus from './ConnectionStatus';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      <Navbar />
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
          {sidebarOpen && <Sidebar />}
        </div>

        {/* Sidebar - Mobile (Overlay) */}
        <div className={`lg:hidden fixed inset-0 z-40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className={`absolute left-0 top-0 bottom-0 w-64 bg-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Botón para toggle sidebar en mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Botón toggle en desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block mb-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>

          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
