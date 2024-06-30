import type React from 'react';

type Role =
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'SECRETARY'
  | 'TREASURER'
  | 'REDACTOR'
  | 'PROJECT_MANAGER'
  | 'COMMUNICATION_OFFICER';

interface TreeNode {
  role: Role;
  name: string;
  children?: TreeNode[];
}

const treeData: TreeNode = {
  role: 'PRESIDENT',
  name: 'Marie Dupont',
  children: [
    {
      role: 'SECRETARY',
      name: 'Emma Petit',
      children: [
        { role: 'REDACTOR', name: 'Nicolas Dubois' },
        { role: 'PROJECT_MANAGER', name: 'Sophie Lefevre' },
        { role: 'COMMUNICATION_OFFICER', name: 'Lucie Lefevre' },
      ],
    },
    {
      role: 'VICE_PRESIDENT',
      name: 'Thomas Martin',
    },
    {
      role: 'TREASURER',
      name: 'Antoine Moreau',
    },
  ],
};

const roleToFrench = (role: Role): string => {
  switch (role) {
    case 'PRESIDENT':
      return 'Président';
    case 'VICE_PRESIDENT':
      return 'Vice-Président';
    case 'SECRETARY':
      return 'Secrétaire';
    case 'TREASURER':
      return 'Trésorier';
    case 'REDACTOR':
      return 'Rédacteur';
    case 'PROJECT_MANAGER':
      return 'Chef de projet';
    case 'COMMUNICATION_OFFICER':
      return 'Chargé de communication';
  }
};

const TreeNode: React.FC<{ node: TreeNode; x: number; y: number; level: number }> = ({ node, x, y, level }) => {
  const childSpacing = 200;
  const levelHeight = 200;
  const nameOffset = 70;

  return (
    <g>
      <circle cx={x} cy={y} r="30" fill="#4a5568" />
      <text x={x} y={y} textAnchor="middle" dy=".3em" fill="white" fontSize="14">
        {node.role
          .split('_')
          .map((word) => word[0])
          .join('')}
      </text>
      <text x={x} y={y + 45} textAnchor="middle" fill="#4a5568" fontSize="14" fontWeight="bold">
        {roleToFrench(node.role)}
      </text>
      <text x={x} y={y + nameOffset} textAnchor="middle" fill="#4a5568" fontSize="14">
        {node.name}
      </text>

      {node.children?.map((child, index) => {
        if (!node.children) return null;
        const childX = x - ((node.children.length - 1) * childSpacing) / 2 + index * childSpacing;
        const childY = y + levelHeight;

        return (
          <g key={`${child.role}-${index}`}>
            <line x1={x} y1={y + 80} x2={childX} y2={childY - 35} stroke="#4a5568" strokeWidth="2" />
            <TreeNode node={child} x={childX} y={childY} level={level + 1} />
          </g>
        );
      })}
    </g>
  );
};

const AssociationHierarchyTree: React.FC = () => {
  const svgWidth = 1000;
  const svgHeight = 700;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h2 className="text-3xl font-bold text-gray-800 pt-4">Hiérarchie de l'association</h2>
      <div className="flex justify-center items-center w-full flex-grow">
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
          <title>Association Hierarchy Tree</title>
          <TreeNode node={treeData} x={svgWidth / 2} y={60} level={0} />
        </svg>
      </div>
    </div>
  );
};

export default AssociationHierarchyTree;
