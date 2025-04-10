
import { Loader } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading data..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader className="h-12 w-12 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
