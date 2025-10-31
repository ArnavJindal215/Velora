import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import resourcesData from "@/data/resources.json";

type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
  };

  const fetchResources = async () => {
    setLoading(true);
    setResources(resourcesData);
    setLoading(false);
  };

  const addToWishlist = async (resourceId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, resource_id: resourceId });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already in Wishlist",
          description: "This resource is already in your wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to wishlist",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Added to wishlist",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold">Video Resources</h1>
          <p className="text-muted-foreground">
            Learn about safe medical waste disposal through our comprehensive video tutorials
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={resource.id} className="hover-lift overflow-hidden group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={resource.thumbnail_url || "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400"}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  {resource.duration && (
                    <Badge className="absolute bottom-2 right-2 bg-black/70">
                      <Clock className="h-3 w-3 mr-1" />
                      {resource.duration}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                      {resource.category && (
                        <Badge variant="outline" className="mt-2">
                          {resource.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => setSelectedVideo(resource)}
                  >
                    Watch Video
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => addToWishlist(resource.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.video_url}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Resources;