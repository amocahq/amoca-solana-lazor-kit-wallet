import React, { useState, useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Leaf, Loader2, AlertTriangle } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Project } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { createSolanaTransaction, connection } from '../utils/solana';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { isConnected, smartWalletAuthorityPubkey, signTransaction, connect } = useWallet();
  const [isInvesting, setIsInvesting] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);
  const [walletStatus, setWalletStatus] = useState<string | null>(null);
  const progress = (project.currentFunding / project.fundingGoal) * 100;

  // Check if user has an existing wallet when component mounts
  useEffect(() => {
    const checkExistingWallet = async () => {
      try {
        // Use the LazorKit wallet API to check if a wallet already exists
        // This depends on the specific API methods available in @lazorkit/wallet
        const hasExistingWallet = await window.navigator.credentials
          .get({ publicKey: { challenge: new Uint8Array([1]) } })
          .then(() => true)
          .catch(() => false);

        if (hasExistingWallet) {
          setWalletStatus("Existing wallet found");
        } else {
          setWalletStatus(null);
        }
      } catch (error) {
        console.error("Error checking for existing wallet:", error);
      } finally {
        setWalletChecked(true);
      }
    };

    if (!isConnected) {
      checkExistingWallet();
    }
  }, [isConnected]);

  const handleInvest = async () => {
    if (!smartWalletAuthorityPubkey) {
      // If wallet is not connected, try to connect first
      if (!isConnected) {
        try {
          await connect();
          return; // Exit function after connecting - user can click invest again
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          return;
        }
      }
      return;
    }
    
    setIsInvesting(true);
    try {
      // Project wallet address (replace with actual project wallet)
      const projectWallet = new PublicKey('11111111111111111111111111111111');
      
      const transaction = await createSolanaTransaction(
        new PublicKey(smartWalletAuthorityPubkey),
        projectWallet,
        1, // 1 SOL
        true // isSol
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(smartWalletAuthorityPubkey);

      const signature = await signTransaction(transaction);
      console.log('Transaction signed:', signature);
      
      // Send the signed transaction
      const txid = await connection.sendRawTransaction(transaction.serialize());
      await connection.confirmTransaction(txid);
      
      alert('Investment successful! Transaction ID: ' + txid);
    } catch (error) {
      console.error('Investment failed:', error);
      alert('Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  // Define the button text and disabled state based on wallet status
  const getButtonConfig = () => {
    if (isConnected) {
      return {
        text: isInvesting ? 'Investing...' : 'Invest 1 SOL',
        disabled: isInvesting,
        icon: isInvesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Leaf className="w-4 h-4" />
      };
    } else if (walletStatus) {
      return {
        text: 'Connect Existing Wallet',
        disabled: false,
        icon: <Leaf className="w-4 h-4" />
      };
    } else {
      return {
        text: 'Connect Wallet to Invest',
        disabled: !walletChecked,
        icon: <Leaf className="w-4 h-4" />
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <Card className="p-6">
      <div className="relative">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <Badge
          variant={
            project.category === 'solar'
              ? 'yellow'
              : project.category === 'wind'
              ? 'blue'
              : 'green'
          }
          className="absolute top-4 right-4"
        >
          {project.category}
        </Badge>
      </div>

      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Raised</p>
            <p className="font-semibold">{formatCurrency(project.currentFunding)}</p>
          </div>
          <div>
            <p className="text-gray-600">Goal</p>
            <p className="font-semibold">{formatCurrency(project.fundingGoal)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">CO₂ Reduction</p>
            <p className="font-semibold">{formatNumber(project.impactMetrics.co2Reduction)} tons</p>
          </div>
          <div>
            <p className="text-gray-600">Returns</p>
            <p className="font-semibold">{project.returns}% APY</p>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleInvest}
          disabled={buttonConfig.disabled}
          className="flex items-center justify-center gap-2"
        >
          {buttonConfig.icon}
          {buttonConfig.text}
        </Button>

        {walletStatus && !isConnected && (
          <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
            <AlertTriangle className="w-3 h-3" />
            <span>{walletStatus}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;