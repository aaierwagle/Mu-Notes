"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import Favourite from "./Favourite ";

// Update the Note and Assignment interfaces to reflect the actual data structure
interface Note {
  _id: string;
  title: string;
  description: string;
  subject: string;
  createdAt: string;
  fileUrl?: string; // Add fileUrl as optional for Notes
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  dueDate: string;
  fileUrl: string; // fileUrl should be required for Assignments
}

interface FavoriteDetails {
  noteDetails: Note;
  assignmentDetails: Assignment;
}

interface FavoriteResponse {
  favoriteDetails: FavoriteDetails[];
}

export default function MapFavourite() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/allfavourite");
        if (response.ok) {
          const data: FavoriteResponse = await response.json();
          
          const fetchedNotes = data.favoriteDetails
            .map((item) => item.noteDetails)
            .filter(Boolean);
          const fetchedAssignments = data.favoriteDetails
            .map((item) => item.assignmentDetails)
            .filter(Boolean);

          setAssignments(fetchedAssignments);
          setNotes(fetchedNotes);
        } else {
          console.error("Failed to fetch favorites.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handlePreview = (fileUrl: string | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      console.error("No file URL available for preview.");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Favorites</h2>

      {isLoading && <p>Loading favorites...</p>}

      {!isLoading && assignments.length === 0 && notes.length === 0 && (
        <p>No favorites found.</p>
      )}

      {/* Render favorite assignments */}
      {assignments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Favorite Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment._id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">Subject: {assignment.subject}</p>
                    <p className="text-sm">Semester: {assignment.semester}</p>
                    <p className="text-sm">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(assignment.fileUrl)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Favourite itemId={assignment._id} type="assignment" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Render favorite notes */}
      {notes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Favorite Notes</h3>
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
                    <p className="text-sm">Created At: {new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {note.fileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(note.fileUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Favourite itemId={note._id} type="note" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
