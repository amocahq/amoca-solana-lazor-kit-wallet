import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Wallet, Wallet as WalletX, RefreshCw, Copy, Check, ChevronDown, AlertCircle, Key, Loader2, Download, Smartphone } from 'lucide-react';
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
  const [localPasskeyAvailable, setLocalPasskeyAvailable] = useState<boolean | null>(null);
  const [nonLocalPasskeyAvailable, setNonLocalPasskeyAvailable] = useState<boolean>(false);
  const [checkingWallet, setCheckingWallet] = useState(false);
  const [checkingOtherDevices, setCheckingOtherDevices] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropSuccess, setAirdropSuccess] = useState(false);
  
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
      setLocalPasskeyAvailable(false); // Reset before check
      setExistingWallet(false);       // Reset before check
      setNonLocalPasskeyAvailable(false); // Reset before check

      // First check for local device passkeys
      const hasLocalCredentials = await window.navigator.credentials
        .get({
          mediation: 'optional',
          publicKey: {
            challenge: new Uint8Array([0, 1, 2, 3]),
            timeout: 60000,
            userVerification: 'preferred',
            rpId: window.location.hostname,
            authenticatorAttachment: 'platform' // Specifically check for platform authenticators (local device)
          }
        })
        .then(cred => !!cred)
        .catch(() => false);

      setLocalPasskeyAvailable(hasLocalCredentials);
      setExistingWallet(hasLocalCredentials); // existingWallet now mirrors localPasskeyAvailable

      // If no local passkey found, check if any passkey exists (other device)
      if (!hasLocalCredentials) {
        const hasAnyCredentials = await window.navigator.credentials
          .get({
            mediation: 'optional',
            publicKey: {
              challenge: new Uint8Array([0, 1, 2, 3]),
              timeout: 60000,
              userVerification: 'preferred',
              rpId: window.location.hostname
              // No authenticatorAttachment, so checks all passkeys (local or other device)
            }
          })
          .then(cred => !!cred)
          .catch(() => false);
        setNonLocalPasskeyAvailable(hasAnyCredentials);
      }
    } catch (error) {
      console.error('Error checking for existing wallet:', error);
      setExistingWallet(false);
      setLocalPasskeyAvailable(false);
      setNonLocalPasskeyAvailable(false);
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

  // Connect using local passkey if available
  const handleConnect = async () => {
    try {
      setCheckingWallet(true);
      // This function is called when localPasskeyAvailable is true,
      // so we prioritize connecting with the local device.
      await connect({
        useExistingCredentials: true,
        preferLocalDevice: true 
      });
    } catch (err) {
      console.error('Failed to connect with local passkey:', err);
    } finally {
      setCheckingWallet(false);
    }
  };

  // Only for explicit "other device" button
  const handleConnectOtherDevice = async () => {
    try {
      setCheckingOtherDevices(true);
      await connect({
        useExistingCredentials: true,
        preferLocalDevice: false
      });
    } catch (err) {
      console.error('Failed to connect with passkey from another device:', err);
    } finally {
      setCheckingOtherDevices(false);
    }
  };

  const handleCreateNewWallet = async () => {
    try {
      setCheckingWallet(true);
      // Create a new wallet (not using existing credentials)
      await connect({ 
        useExistingCredentials: false
      });
    } catch (err) {
      console.error('Failed to create new wallet:', err);
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

  const handleAirdropSol = async () => {
    if (!smartWalletAuthorityPubkey) return;
    
    setIsAirdropping(true);
    setAirdropSuccess(false);
    
    try {
      const publicKey = new PublicKey(smartWalletAuthorityPubkey);
      
      // Request 1 SOL airdrop (1 SOL = 1,000,000,000 lamports)
      const signature = await connection.requestAirdrop(
        publicKey,
        1_000_000_000
      );
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      // Refresh balances
      await fetchBalances();
      
      // Set success state
      setAirdropSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setAirdropSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Airdrop failed:', error);
      alert('Failed to airdrop SOL. Please try again later.');
    } finally {
      setIsAirdropping(false);
    }
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
              
              <div className="mt-2 flex gap-2 justify-between items-center">
                <button 
                  onClick={fetchBalances} 
                  disabled={isLoadingBalance}
                  className="text-xs flex items-center justify-center text-purple-600 hover:text-purple-800"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <button
                  onClick={handleAirdropSol}
                  disabled={isAirdropping}
                  className={`text-xs flex items-center justify-center px-2 py-1 rounded ${
                    airdropSuccess 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  } transition-colors`}
                >
                  {isAirdropping ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      <span>Airdropping...</span>
                    </>
                  ) : airdropSuccess ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      <span>Airdrop Received!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      <span>Airdrop 1 SOL</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-3 pt-2 border-t">
                <div className="flex flex-col space-y-2">
                  {/* Remove the Copy Private Key button and keep only the Disconnect button */}
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
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {/* This button appears if a local passkey is available */}
          {existingWallet && ( 
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              disabled={isLoading || checkingWallet || checkingOtherDevices}
              className="flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isLoading || checkingWallet
                ? 'Connecting...'
                : 'Connect with Local Passkey'
              }
            </Button>
          )}
          
          <Button
            variant={existingWallet ? "outline" : "primary"} // Variant depends on local passkey availability
            size="sm"
            onClick={handleCreateNewWallet}
            disabled={isLoading || checkingWallet || checkingOtherDevices}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {isLoading || checkingWallet ? 'Creating...' : 'Create New Wallet'}
          </Button>
          
          {/* Show "Use passkey from another device" if no local passkey, but other passkeys might exist */}
          {!localPasskeyAvailable && nonLocalPasskeyAvailable && !isConnected && !isLoading && (
            <button 
              onClick={handleConnectOtherDevice}
              disabled={checkingOtherDevices}
              className="mt-1 text-xs flex items-center justify-center gap-1 text-purple-600 hover:text-purple-800"
            >
              {checkingOtherDevices ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Looking for passkeys...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3 h-3" />
                  <span>Use passkey from another device</span>
                </>
              )}
            </button>
          )}
          
          {/* Message indicating local passkey detection */}
          {localPasskeyAvailable && !isConnected && !isLoading && (
            <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Local passkey detected. Use "Connect with Local Passkey".</span>
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