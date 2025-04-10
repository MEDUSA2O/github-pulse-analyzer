
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Error", 
  message, 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
