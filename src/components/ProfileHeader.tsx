
import { GitHubUser } from "@/types/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Star, 
  GitFork, 
  Calendar, 
  MapPin, 
  Building, 
  Link as LinkIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  user: GitHubUser;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-28 w-28">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <a 
                href={user.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                @{user.login}
              </a>
            </div>
            
            {user.bio && <p>{user.bio}</p>}
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  <strong>{user.followers}</strong> followers · <strong>{user.following}</strong> following
                </span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {joinDate}</span>
              </div>
              
              {user.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.company && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{user.company}</span>
                </div>
              )}
              
              {user.blog && (
                <div className="flex items-center text-muted-foreground">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  <a 
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  View GitHub Profile
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-4 md:w-40">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-primary">{user.public_repos}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-primary">{user.public_gists}</div>
              <div className="text-sm text-muted-foreground">Gists</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
