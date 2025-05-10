import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Wallet, Wallet as WalletX, RefreshCw, Copy, Check, ChevronDown, AlertCircle } from 'lucide-react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [existingWallet, setExistingWallet] = useState<boolean | null>(null);
  const [checkingWallet, setCheckingWallet] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check for existing wallet when component mounts
  useEffect(() => {
    if (!isConnected && !checkingWallet) {
      checkForExistingWallet();
    }
  }, [isConnected]);
  
  // Function to check for existing wallet
  const checkForExistingWallet = async () => {
    try {
      setCheckingWallet(true);
      
      // This is a simplified check - the specific implementation will depend on how
      // @lazorkit/wallet handles credential storage
      // You may need to use a specific method provided by the SDK
      
      // Try to get credential info if it exists
      const hasCredentials = await window.navigator.credentials
        .get({
          mediation: 'optional',
          publicKey: {
            challenge: new Uint8Array([0, 1, 2, 3]),
            timeout: 60000,
            userVerification: 'preferred',
            rpId: window.location.hostname
          }
        })
        .then(cred => !!cred)
        .catch(() => false);
      
      setExistingWallet(hasCredentials);
    } catch (error) {
      console.error('Error checking for existing wallet:', error);
      setExistingWallet(false);
    } finally {
      setCheckingWallet(false);
    }
  };

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
      setCheckingWallet(true);
      // If we know there's an existing wallet, pass that info to connect
      // The specific parameter will depend on the lazorkit implementation
      // This is pseudocode - adjust to actual API
      await connect({ useExistingCredentials: true });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setCheckingWallet(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
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

  // Function to get appropriate button text based on wallet status
  const getConnectButtonText = () => {
    if (isLoading || checkingWallet) return 'Connecting...';
    if (existingWallet) return 'Connect Existing Wallet';
    return 'Connect Wallet';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isConnected ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100"
          >
            <Wallet className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">
              {smartWalletAuthorityPubkey?.slice(0, 4)}...
              {smartWalletAuthorityPubkey?.slice(-4)}
            </span>
            <ChevronDown className="w-3 h-3" />
          </Button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 p-3 border rounded-md bg-white shadow-lg z-10">
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
              
              <div className="mt-3 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="w-full h-8 justify-center text-sm"
                >
                  <WalletX className="w-3 h-3 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col">
          <Button
            variant="primary"
            size="sm"
            onClick={handleConnect}
            disabled={isLoading || checkingWallet}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {getConnectButtonText()}
          </Button>
          
          {existingWallet && !isConnected && !isLoading && (
            <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Using existing passkey wallet</span>
            </div>
          )}
        </div>
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