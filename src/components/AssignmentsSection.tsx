"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Download, Eye } from "lucide-react";
import { signIn } from "next-auth/react";

// Define a type for the assignment
interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  semester: number;
  dueDate: string;
  fileUrl: string;
}

export default function AssignmentsSection() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
  });

  // Use useCallback to memoize the fetchAssignments function
  const fetchAssignments = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.subject) params.append("subject", filters.subject);

    const response = await fetch(`/api/assignments?${params}`);
    const data = await response.json();
    setAssignments(data);
  }, [filters]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]); // Add fetchAssignments as a dependency

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <Button
                size="sm"
                onClick={() => handleDownload(assignment.fileUrl)}
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
