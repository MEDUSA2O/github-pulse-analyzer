import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserSearch from "@/components/UserSearch";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ProfileHeader from "@/components/ProfileHeader";
import RepoList from "@/components/RepoList";
import { GitHubUser, RepositoryWithCommits } from "@/types/github";
import { getUser, fetchReposWithCommits } from "@/services/githubService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [username, setUsername] = useState<string>("");
  const { toast } = useToast();
  
  // Query for user data
  const userQuery = useQuery({
    queryKey: ["githubUser", username],
    queryFn: () => getUser(username),
    enabled: !!username,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for repositories with commits
  const reposQuery = useQuery({
    queryKey: ["githubRepos", username],
    queryFn: () => fetchReposWithCommits(username),
    enabled: !!username && !!userQuery.data,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching repositories",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const handleSearch = (value: string) => {
    setUsername(value);
  };

  const renderContent = () => {
    // Initial state - no search yet
    if (!username) {
      return (
        <div className="mt-20 text-center text-muted-foreground">
          <p>Enter a GitHub username to start analyzing.</p>
        </div>
      );
    }

    // Loading user data
    if (userQuery.isLoading) {
      return <LoadingState message={`Looking up ${username}...`} />;
    }

    // Error fetching user
    if (userQuery.isError) {
      return (
        <ErrorState
          message={(userQuery.error as Error).message}
          onRetry={() => userQuery.refetch()}
        />
      );
    }

    // User data loaded, now show profile and repos
    const user = userQuery.data as GitHubUser;
    
    return (
      <div className="space-y-6">
        <ProfileHeader user={user} />
        
        {reposQuery.isLoading ? (
          <LoadingState message="Fetching repositories and commit history..." />
        ) : reposQuery.isError ? (
          <ErrorState
            title="Repository Error"
            message="Unable to load repositories. Please try again."
            onRetry={() => reposQuery.refetch()}
          />
        ) : (
          <RepoList repos={reposQuery.data as RepositoryWithCommits[]} />
        )}
      </div>
    );
  };

  return (
    <main className="container py-8 px-4 max-w-[1200px] mx-auto">
      <UserSearch onSearch={handleSearch} isLoading={userQuery.isLoading || reposQuery.isLoading} />
      
      <div className="mt-8">
        {renderContent()}
      </div>

      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>
          GitHub Profile Analyzer | Using GitHub public API | 
          <a 
            href="https://docs.github.com/en/rest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-primary hover:underline"
          >
            API Docs
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Index;
