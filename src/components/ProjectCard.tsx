import React from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Leaf } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Project } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onInvest: (amount: number) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInvest }) => {
  const { isConnected } = useWallet();
  const progress = (project.currentFunding / project.fundingGoal) * 100;

  const handleInvest = async () => {
    try {
      // For demo purposes, we'll invest a fixed amount of 1 SOL
      await onInvest(1);
    } catch (error) {
      console.error('Investment failed:', error);
    }
  };

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
          disabled={!isConnected}
          className="flex items-center justify-center gap-2"
        >
          <Leaf className="w-4 h-4" />
          {isConnected ? 'Invest 1 SOL' : 'Connect Wallet to Invest'}
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;