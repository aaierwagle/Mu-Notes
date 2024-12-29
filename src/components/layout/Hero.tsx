import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, FileText } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-primary/5 to-background pt-16 pb-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 text-black">
              Your Academic Journey
              <br />
              Made Easier
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Access and share quality educational resources. Find notes, assignments, and study materials all in one place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Notes
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="w-5 h-5" />
                View Assignments
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                alt="Students studying"
                fill
                className="object-cover rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: BookOpen,
              title: "Organized Notes",
              description: "Access structured study materials by semester and subject"
            },
            {
              icon: FileText,
              title: "Assignment Hub",
              description: "Stay updated with latest assignments and submissions"
            },
            {
              icon: GraduationCap,
              title: "Easy Sharing",
              description: "Share and access resources with your peers seamlessly"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}