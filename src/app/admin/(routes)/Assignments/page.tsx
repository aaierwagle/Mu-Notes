"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { EditDialog } from "@/components/(assinments)/EditDialog";
import { DeleteDialog } from "@/components/(assinments)/DeleteDialog";
import AddAssignments from "@/components/(assinments)/AddAssignments";

// Define the assignment type
interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: string;
  dueDate: string;
  downloadCount: number;
  fileUrl: string;
}

export default function AssignmentsSection() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
  });

  // useCallback to memoize the function and avoid unnecessary re-renders
  const fetchAssignments = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.subject) params.append("subject", filters.subject);

    const response = await fetch(`/api/assignments?${params}`);
    const data = await response.json();
    setAssignments(data);
  }, [filters]); // `fetchAssignments` now depends on `filters`

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]); // Include `fetchAssignments` in the dependency array

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  // Define the handleDownloadCount function
  const handleDownloadCount = async (assignmentId: string) => {
    try {
      // Call API to update download count (this is just an example)
      const response = await fetch(`/api/assignments/${assignmentId}/incrementDownloadCount`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Update the local state to reflect the new download count
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId
              ? { ...assignment, downloadCount: assignment.downloadCount + 1 }
              : assignment
          )
        );
      } else {
        console.error("Failed to update download count");
      }
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <AddAssignments />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

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
                <p className="text-sm">Download Count: {assignment.downloadCount}</p>
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
              <EditDialog assignmentId={assignment._id} />
              <DeleteDialog assignmentId={assignment._id} />
              <Button
                size="sm"
                onClick={() => handleDownloadCount(assignment._id)}
              >
                Download Count
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
