import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  resource_id: string | null;
  product_id: string | null;
  resources?: {
    title: string;
    description: string | null;
    video_url: string;
    thumbnail_url: string | null;
    category: string | null;
  } | null;
  medicinal_products?: {
    name: string;
    category: string;
    description: string | null;
    image_url: string | null;
    hazard_level: string | null;
  } | null;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchWishlist(session.user.id);
  };

  const fetchWishlist = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        id,
        resource_id,
        product_id,
        resources (
          title,
          description,
          video_url,
          thumbnail_url,
          category
        ),
        medicinal_products (
          name,
          category,
          description,
          image_url,
          hazard_level
        )
      `)
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } else {
      setWishlist(data || []);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Removed from wishlist",
      });
      setWishlist(wishlist.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding products and resources to your wishlist
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/search")}>
                Browse Products
              </Button>
              <Button variant="outline" onClick={() => navigate("/resources")}>
                View Resources
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const isResource = !!item.resources;
              const resource = item.resources;
              const product = item.medicinal_products;
              
              return (
                <Card key={item.id} className="hover-lift overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={
                        isResource
                          ? resource?.thumbnail_url || "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400"
                          : product?.image_url || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"
                      }
                      alt={isResource ? resource?.title : product?.name}
                      className="w-full h-full object-cover"
                    />
                    {!isResource && product?.hazard_level && (
                      <Badge className="absolute top-2 right-2">
                        {product.hazard_level}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {isResource ? resource?.title : product?.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{isResource ? resource?.category : product?.category}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {isResource ? resource?.description : product?.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          isResource
                            ? window.open(item.resources?.video_url, "_blank")
                            : navigate("/search")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {isResource ? "Watch" : "View"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;