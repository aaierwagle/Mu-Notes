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

export function DeleteDialog({ assignmentId }: { assignmentId: string }) {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/assignments/${assignmentId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json(); // Just fetch and ignore the data
    };

    fetchData().catch(console.error);
  }, [assignmentId]);

  const handleDelete = async () => {
    const response = await fetch(`/api/assignments/${assignmentId}`, {
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
          <DialogTitle>Delete Assignment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this assignment? This action is
            irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              No
            </Button>
          </DialogClose>
          {/* Use 'destructive' for the delete button */}
          <Button type="submit" variant="destructive" onClick={handleDelete}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
