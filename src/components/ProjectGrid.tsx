import React from 'react';
import { useWallet } from '@lazorkit/wallet';
import ProjectCard from './ProjectCard';
import { mockProjects } from '../data/mockData';

const ProjectGrid: React.FC = () => {
  const { signMessage } = useWallet();

  const handleInvest = async (amount: number) => {
    try {
      // In a real implementation, we would create a proper Solana transaction here
      const mockInstruction = {
        amount,
        timestamp: Date.now(),
      };
      
      const txid = await signMessage(mockInstruction);
      console.log('Transaction signed:', txid);
      
      // Here we would handle the actual token transfer
      alert('Investment successful! Transaction ID: ' + txid);
    } catch (error) {
      console.error('Investment failed:', error);
      alert('Investment failed. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProjects
        .filter(project => ['solar', 'wind', 'hydro'].includes(project.category))
        .map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onInvest={handleInvest}
          />
        ))}
    </div>
  );
};

export default ProjectGrid;