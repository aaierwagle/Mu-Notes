import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText } from "lucide-react";
import NotesSection from "@/components/NotesSection";
import AssignmentsSection from "@/components/AssignmentsSection";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Assignments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes">
            <Card>
              <CardContent className="p-6">
                <NotesSection />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card>
              <CardContent className="p-6">
                <AssignmentsSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}