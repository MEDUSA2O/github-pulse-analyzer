
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Github } from "lucide-react";

interface UserSearchProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch, isLoading = false }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Github className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-3xl font-bold">GitHub Profile Analyzer</h1>
        </div>
        <p className="text-muted-foreground">
          Enter a GitHub username to analyze their public activity and repositories.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="GitHub username (e.g., octocat)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? "Searching..." : "Analyze Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserSearch;
