import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !feedback) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "0c707eff-0c10-4133-ae2c-df314ee23d03",
          name,
          email,
          message: feedback,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback! We'll review it soon.",
        });
        setName("");
        setEmail("");
        setFeedback("");
      } else {
        toast({
          title: "Submission Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not submit feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Feedback Form */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-foreground">Send Us Your Feedback</h3>
            <p className="text-muted-foreground">
              Help us improve our medical waste disposal guidance
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Your Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-background/50 min-h-[100px]"
              />
              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </form>
          </div>

          {/* About Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Safe Disposal, Healthier Future
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We're dedicated to providing comprehensive guidance on proper medical waste disposal 
                to protect healthcare workers, patients, and the environment.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Our Mission</h4>
              <p className="text-sm text-muted-foreground">
                Empowering healthcare facilities with evidence-based disposal protocols 
                for all types of medical waste.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">
                For urgent disposal queries, consult your facility's waste management coordinator.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Medical Waste Disposal Guide. All rights reserved.</p>
          <p className="mt-2">
            Always follow local regulations and facility protocols for medical waste disposal.
          </p>
        </div>
      </div>
    </footer>
  );
};
