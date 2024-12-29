"use client";

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
import { useEffect } from "react";

export function DeleteNote({ noteId }: { noteId: string }) {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json(); // Fetch data but don't use it
    };

    fetchData().catch(console.error);
  }, [noteId]);

  const handleDelete = async () => {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.reload();
    } else {
      // Handle error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              No
            </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" onClick={handleDelete}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
