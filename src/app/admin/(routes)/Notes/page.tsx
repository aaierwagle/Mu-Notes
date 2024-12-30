"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download } from "lucide-react";
import { EditNote } from "@/components/(notes)/EditDialog";
import { DeleteNote } from "@/components/(notes)/DeleteDialog";
import AddNotes from "@/components/(notes)/AddNotes";
import { SemestersData } from "@/constant/SemesterData";

// Define the Subject type (assuming a subject has at least a name property)
interface Subject {
  name: string;
  // Add other properties if necessary
}

// Define the note type
interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  dueDate: string;
  downloadCount: number;
  fileUrl: string;
}

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
  });
  const [semesterSubjects, setSemesterSubjects] = useState<Subject[]>([]); // Fixed the type to Subject[]

  // useCallback to memoize the function and avoid unnecessary re-renders
  const fetchnotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.subject) params.append("subject", filters.subject);

    const response = await fetch(`/api/notes?${params}`);
    const data = await response.json();
    setNotes(data);
  }, [filters]);

  useEffect(() => {
    fetchnotes();
  }, [fetchnotes]);

  // Handle semester change
  const handleSemesterChange = (semester: string) => {
    setFilters((prev) => ({ ...prev, semester }));
    const selectedSemester = SemestersData.find((data) => data.semester === semester);
    if (selectedSemester) {
      setSemesterSubjects(selectedSemester.subjects);
    } else {
      setSemesterSubjects([]);
    }
  };

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || fileUrl.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <AddNotes />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={filters.semester}
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester"].map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem}
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
            {semesterSubjects.map((subject) => (
              <SelectItem key={subject.name} value={subject.name}>
                {subject.name}
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
                <p className="text-sm">Due Date: {new Date(note.dueDate).toLocaleDateString()}</p>
                <p className="text-sm">Download Count: {note.downloadCount}</p>
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
                variant="outline"
                size="sm"
                onClick={() => handleDownload(note.fileUrl, `${note.title}.pdf`)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <EditNote noteId={note._id} />
              <DeleteNote noteId={note._id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
