
import React, { useState } from "react";
import { RepositoryWithCommits } from "@/types/github";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ArrowUpDown, Search, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommitChart from "./CommitChart";

interface RepoListProps {
  repos: RepositoryWithCommits[];
}

type SortKey = "name" | "stars" | "forks" | "updated" | "commits";
type SortDirection = "asc" | "desc";

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);

  // Filter repos based on search term
  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort repos based on sort key and direction
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortKey) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "stars":
        comparison = a.stargazers_count - b.stargazers_count;
        break;
      case "forks":
        comparison = a.forks_count - b.forks_count;
        break;
      case "updated":
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case "commits":
        comparison = (a.totalCommits || 0) - (b.totalCommits || 0);
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  return (
    <Card className="border shadow-sm mt-6">
      <CardHeader className="pb-3">
        <CardTitle>Repositories ({repos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={sortKey}
            onValueChange={(value) => setSortKey(value as SortKey)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="forks">Forks</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="commits">Recent Commits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 hover:bg-transparent font-medium"
                    onClick={() => toggleSort("name")}
                  >
                    Repository
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 hover:bg-transparent font-medium"
                    onClick={() => toggleSort("stars")}
                  >
                    <Star className="mr-1 h-3.5 w-3.5" />
                    Stars
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 hover:bg-transparent font-medium"
                    onClick={() => toggleSort("forks")}
                  >
                    <GitFork className="mr-1 h-3.5 w-3.5" />
                    Forks
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Language</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 hover:bg-transparent font-medium"
                    onClick={() => toggleSort("commits")}
                  >
                    Recent Commits
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRepos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No repositories found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedRepos.map((repo) => (
                  <React.Fragment key={repo.id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          <div className="flex items-center">
                            {repo.name}
                            {repo.fork && (
                              <Badge variant="outline" className="ml-2">
                                <GitFork className="h-3 w-3 mr-1" />
                                Fork
                              </Badge>
                            )}
                          </div>
                          {repo.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {repo.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {repo.stargazers_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {repo.forks_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {repo.language ? (
                          <Badge variant="secondary" className="font-normal">
                            <Code className="h-3 w-3 mr-1" />
                            {repo.language}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {repo.totalCommits || 0} in past 30 days
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedRepo === repo.name && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-muted/20">
                            <h4 className="text-sm font-medium mb-2">
                              Commit Activity (Past 30 Days)
                            </h4>
                            <div className="h-[200px]">
                              <CommitChart commits={repo.commits || []} />
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                asChild
                              >
                                <a 
                                  href={repo.html_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  View Repository
                                </a>
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepoList;
