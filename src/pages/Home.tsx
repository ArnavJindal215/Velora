import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-medical.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Safe Medical Waste Disposal
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted partner in environmentally responsible pharmaceutical waste management
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="hover-scale">
                <Link to="/search">Find Disposal Info</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale">
                <Link to="/resources">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Environmental Protection</CardTitle>
                  <CardDescription>
                    Eco-friendly disposal methods that protect our planet
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Safety First</CardTitle>
                  <CardDescription>
                    Compliant with all healthcare safety regulations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Expert Guidance</CardTitle>
                  <CardDescription>
                    Professional advice from experienced healthcare specialists
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;