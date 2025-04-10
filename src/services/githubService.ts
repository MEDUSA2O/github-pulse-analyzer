
import { CommitsByDay, GitHubCommit, GitHubRepo, GitHubUser, RepositoryWithCommits } from "@/types/github";

const BASE_URL = "https://api.github.com";

export async function getUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user data");
  }
  
  return response.json();
}

export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }
  
  return response.json();
}

export async function getRepoCommits(username: string, repo: string, days: number = 30): Promise<GitHubCommit[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const sinceParam = since.toISOString();
  
  const response = await fetch(
    `${BASE_URL}/repos/${username}/${repo}/commits?since=${sinceParam}&per_page=100`
  );
  
  if (!response.ok) {
    if (response.status === 409) {
      // Empty repository
      return [];
    }
    throw new Error(`Failed to fetch commits for ${repo}`);
  }
  
  return response.json();
}

export function groupCommitsByDay(commits: GitHubCommit[]): CommitsByDay[] {
  const commitMap = new Map<string, number>();
  
  // Get the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Initialize all days with zero commits
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(thirtyDaysAgo.getDate() + i);
    // Format to YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    commitMap.set(dateStr, 0);
  }
  
  // Count commits by day
  commits.forEach((commit) => {
    try {
      // Safely extract date part from commit date string
      if (commit.commit && commit.commit.author && commit.commit.author.date) {
        // Format to YYYY-MM-DD
        const date = commit.commit.author.date.split('T')[0];
        if (date && commitMap.has(date)) {
          commitMap.set(date, (commitMap.get(date) || 0) + 1);
        }
      }
    } catch (error) {
      console.error("Error processing commit date:", error);
    }
  });
  
  // Convert map to array
  return Array.from(commitMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchReposWithCommits(
  username: string,
  days: number = 30
): Promise<RepositoryWithCommits[]> {
  try {
    const repos = await getUserRepos(username);
    
    // Get commits for non-fork repositories (to avoid too many API calls)
    const reposWithCommits = await Promise.all(
      repos.map(async (repo) => {
        // Skip forks to save API calls
        if (repo.fork) {
          return { ...repo, commits: [], totalCommits: 0 };
        }
        
        try {
          const commits = await getRepoCommits(username, repo.name, days);
          const commitsByDay = groupCommitsByDay(commits);
          const totalCommits = commits.length;
          
          return {
            ...repo,
            commits: commitsByDay,
            totalCommits,
          };
        } catch (error) {
          console.error(`Error fetching commits for ${repo.name}:`, error);
          return { ...repo, commits: [], totalCommits: 0 };
        }
      })
    );
    
    return reposWithCommits;
  } catch (error) {
    console.error("Error fetching repos with commits:", error);
    throw error;
  }
}
