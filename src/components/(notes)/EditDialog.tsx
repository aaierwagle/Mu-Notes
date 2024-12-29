// "use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for the "as" issue
import { Label } from "@/components/ui/label";
import { useState, useEffect, ChangeEvent } from "react";

// Define props type for EditNote component
interface EditNoteProps {
  noteId: string; // Type the noteId prop
}

export function EditNote({ noteId }: EditNoteProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setSubject(data.subject);
      setSemester(data.semester);
      setChapter(data.chapter);
      setFileUrl(data.fileUrl);
      setFileType(data.fileType);
    };

    fetchData().catch(console.error);
  }, [noteId]);

  const handleEdit = async () => {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        subject,
        semester,
        chapter,
        fileUrl,
        fileType,
      }),
    });
    if (response.ok) {
      window.location.reload(); // Handle successful edit
    } else {
      // Handle error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Details</DialogTitle>
          <DialogDescription>Edit the details of this item.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="sr-only">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="sr-only">
              Description
            </Label>
            {/* Use Textarea instead of Input with "as" prop */}
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject" className="sr-only">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="Enter subject"
              value={subject}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="semester" className="sr-only">
              Semester
            </Label>
            <Input
              id="semester"
              type="number"
              placeholder="Enter semester"
              value={semester}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSemester(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="chapter" className="sr-only">
              Chapter
            </Label>
            <Input
              id="chapter"
              placeholder="Enter chapter"
              value={chapter}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setChapter(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileUrl" className="sr-only">
              File URL
            </Label>
            <Input
              id="fileUrl"
              placeholder="Enter file URL"
              value={fileUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFileUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileType" className="sr-only">
              File Type
            </Label>
            <Input
              id="fileType"
              placeholder="Enter file type"
              value={fileType}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFileType(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="outline" onClick={handleEdit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
