import React from 'react';
import WalletConnect from './components/WalletConnect';
import ProjectGrid from './components/ProjectGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-700">AMOCA</h1>
            <WalletConnect />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Green Energy Projects</h2>
          <p className="text-gray-600">
            Invest in sustainable energy projects and earn returns while helping the environment.
          </p>
        </div>
        <ProjectGrid />
      </main>
    </div>
  );
}

export default App;