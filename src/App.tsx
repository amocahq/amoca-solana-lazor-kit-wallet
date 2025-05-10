import React from 'react';
import WalletConnect from './components/WalletConnect';

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
        <p>Start prompting (or editing) to see magic happen :)</p>
      </main>
    </div>
  );
}

export default App;