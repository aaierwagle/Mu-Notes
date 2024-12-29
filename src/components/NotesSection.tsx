"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Download, Eye } from "lucide-react";
import { signIn } from "next-auth/react";

// Define the type for the note object
interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  chapter: string;
  fileUrl: string;
}

export default function NotesSection() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]); // Use the Note type
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
    chapter: "",
  });

  // Use useCallback to memoize the fetchNotes function
  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.subject) params.append("subject", filters.subject);
    if (filters.chapter) params.append("chapter", filters.chapter);

    const response = await fetch(`/api/notes?${params}`);
    const data = await response.json();
    setNotes(data);
  }, [filters]); // Re-run when filters change

  useEffect(() => {
    fetchNotes(); // Call fetchNotes when filters change
  }, [fetchNotes]); // Make sure fetchNotes is included in the dependency array

  const handleDownload = async (fileUrl: string) => {
    if (!session) {
      signIn("google");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.semester}
          onValueChange={(value) => setFilters({ ...filters, semester: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>
                Semester {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.subject}
          onValueChange={(value) => setFilters({ ...filters, subject: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {["Mathematics", "Physics", "Computer Science", "Electronics"].map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.chapter}
          onValueChange={(value) => setFilters({ ...filters, chapter: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Chapter" />
          </SelectTrigger>
          <SelectContent>
            {["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"].map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note._id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{note.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">Subject: {note.subject}</p>
                <p className="text-sm">Semester: {note.semester}</p>
                <p className="text-sm">Chapter: {note.chapter}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(note.fileUrl)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownload(note.fileUrl)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
