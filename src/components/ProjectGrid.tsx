import React from 'react';
import ProjectCard from './ProjectCard';
import { mockProjects } from '../data/mockData';

const ProjectGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProjects
        .filter(project => ['solar', 'wind', 'hydro'].includes(project.category))
        .map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
    </div>
  );
};

export default ProjectGrid;