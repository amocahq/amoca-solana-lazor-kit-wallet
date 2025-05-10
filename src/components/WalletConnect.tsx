import React, { useState, useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Wallet, Wallet as WalletX, RefreshCw, Copy, Check } from 'lucide-react';
import Button from './ui/Button';
import { connection, USDC_MINT } from '../utils/solana';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const WalletConnect: React.FC = () => {
  const {
    smartWalletAuthorityPubkey,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  } = useWallet();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchBalances = async () => {
    if (!smartWalletAuthorityPubkey) return;
    
    try {
      setIsLoadingBalance(true);
      
      // Fetch SOL balance
      const publicKey = new PublicKey(smartWalletAuthorityPubkey);
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / 1_000_000_000); // Convert lamports to SOL
      
      // Fetch USDC balance
      try {
        const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);
        setUsdcBalance(Number(tokenBalance.value.uiAmount));
      } catch (err) {
        console.log("No USDC account found or other error", err);
        setUsdcBalance(0);
      }
    } catch (err) {
      console.error('Error fetching balances:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (isConnected && smartWalletAuthorityPubkey) {
      fetchBalances();
    } else {
      setSolBalance(null);
      setUsdcBalance(null);
    }
  }, [isConnected, smartWalletAuthorityPubkey]);

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

  const handleSignMessage = async () => {
    try {
      const instruction = {}; // Replace with a valid TransactionInstruction
      const txid = await signMessage(instruction);
      console.log('Transaction ID:', txid);
    } catch (err) {
      console.error('Failed to sign message:', err);
    }
  };

  const copyToClipboard = () => {
    if (smartWalletAuthorityPubkey) {
      navigator.clipboard.writeText(smartWalletAuthorityPubkey)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex flex-col gap-2 p-3 border rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-800">
                {smartWalletAuthorityPubkey?.slice(0, 6)}...
                {smartWalletAuthorityPubkey?.slice(-4)}
              </span>
              <button 
                onClick={copyToClipboard}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy full address"
              >
                {copied ? 
                  <Check className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="h-8 px-3"
            >
              <WalletX className="w-3 h-3 mr-1" />
              Disconnect
            </Button>
          </div>
          
          <div className="mt-2 border-t pt-2 text-xs text-gray-500">
            Network: <span className="font-medium text-purple-600">Devnet</span>
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">SOL:</span>
              <div className="flex items-center">
                {isLoadingBalance ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <span className="font-medium">{solBalance !== null ? solBalance.toFixed(4) : '0'}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">USDC:</span>
              <div className="flex items-center">
                {isLoadingBalance ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <span className="font-medium">{usdcBalance !== null ? usdcBalance.toFixed(2) : '0'}</span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={fetchBalances} 
            disabled={isLoadingBalance}
            className="mt-1 text-xs flex items-center justify-center text-purple-600 hover:text-purple-800"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingBalance ? 'animate-spin' : ''}`} />
            Refresh Balances
          </button>
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