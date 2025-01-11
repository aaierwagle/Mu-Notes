"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { SemestersData } from "@/constant/SemesterData";
import Favourite from "./(makebetter)/Favourite ";

interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  chapter: string;
  fileUrl: string;
}

// Function to convert semester name to number
const getSemesterNumber = (semester: string): string => {
  const semesterMap: { [key: string]: string } = {
    "1st Semester": "1",
    "2nd Semester": "2",
    "3rd Semester": "3",
    "4th Semester": "4",
    "5th Semester": "5",
    "6th Semester": "6",
    "7th Semester": "7",
    "8th Semester": "8",
  };
  return semesterMap[semester] || semester;
};

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
    chapter: "",
  });

  const fetchNotes = useCallback(async (page: number, isLoadMore: boolean = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      // Transform semester value before adding to params
      if (filters.semester) {
        const semesterNumber = getSemesterNumber(filters.semester);
        params.append("semester", semesterNumber);
      }
      
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.chapter) params.append("chapter", filters.chapter);
      params.append("page", page.toString());
      

      const response = await fetch(`/api/assignments?${params}`);
      const data = await response.json();

      const processedData = data.map((note: Note, index: number) => ({
        ...note,
        uniqueId: `${note._id}-${page}-${index}`
      }));

      setHasMore(data.length === 10);
      setNotes(prevNotes => isLoadMore ? [...prevNotes, ...processedData] : processedData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
    fetchNotes(1, false);
  }, [filters, fetchNotes]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNotes(nextPage, true);
  };

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const semesterData = SemestersData.find(
    (semester) => semester.semester === filters.semester
  );
  const subjects = semesterData ? semesterData.subjects : [];
  const chapters = subjects.find(
    (subject) => subject.name === filters.subject
  )?.chapters || [];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.semester}
          onValueChange={(value) => setFilters({ ...filters, semester: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {SemestersData.map((sem, index) => (
              <SelectItem key={`semester-${index}`} value={sem.semester}>
                {sem.semester}
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
            {subjects.map((subject, index) => (
              <SelectItem key={`subject-${index}`} value={subject.name}>
                {subject.name}
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
            {chapters.map((chapter, index) => (
              <SelectItem key={`chapter-${index}`} value={chapter.name}>
                {chapter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: Note & { uniqueId?: string }) => (
          <Card key={note.uniqueId || `${note._id}-${Math.random()}`}>
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
              <Favourite itemId={note._id} type="note" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6">
        {hasMore && (
          <Button 
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
}