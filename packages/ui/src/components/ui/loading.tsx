import { Loader2 } from 'lucide-react';
import type React from 'react';

interface FullPageSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loading: React.FC<FullPageSpinnerProps> = ({ size = 64, color = 'text-primary', className = '' }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className={`animate-spin ${color} ${className}`} size={size} />
    </div>
  );
};

export default Loading;
