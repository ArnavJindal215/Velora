import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import missionImage from "@/assets/about-mission.jpg";
import teamImage from "@/assets/about-team.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-12">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  We are dedicated to providing safe and environmentally responsible solutions for medical waste disposal. 
                  Our mission is to protect both public health and the environment through proper pharmaceutical waste management.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With years of experience in healthcare waste management, we provide comprehensive guidance for proper disposal 
                  of medications, sharps, and other medical materials.
                </p>
              </div>
              <img 
                src={missionImage} 
                alt="Medical waste management" 
                className="rounded-lg shadow-lg hover-scale"
              />
            </div>
          </div>

          <div className="relative">
            <img 
              src={teamImage} 
              alt="Healthcare team" 
              className="rounded-lg shadow-xl w-full h-64 object-cover animate-fade-in"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  To promote safe disposal practices and minimize environmental impact of pharmaceutical waste
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A world where medical waste is handled responsibly by all healthcare facilities and individuals
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Safety, environmental stewardship, education, and compliance with healthcare regulations
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;