import React from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Wallet, Wallet as WalletX } from 'lucide-react';
import Button from './ui/Button';

const WalletConnect: React.FC = () => {
  const {
    smartWalletAuthorityPubkey,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {smartWalletAuthorityPubkey?.slice(0, 4)}...
            {smartWalletAuthorityPubkey?.slice(-4)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="flex items-center gap-2"
          >
            <WalletX className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={handleConnect}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
      {error && (
        <div className="absolute top-full mt-2 w-full p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;