import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';

const Favourite = ({ itemId, type }: { itemId: string; type: 'note' | 'assignment' }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if the item is already in favorites on component mount
  useEffect(() => {
    if (!session) return; // Don't check if there's no session

    const checkIfFavorited = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/favourite?itemId=${itemId}&type=${type}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        } else {
          console.error('Failed to fetch favorite status');
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfFavorited();
  }, [itemId, type, session]);

  const handleFavouriteClick = () => {
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    if (isFavorited) {
      handleUnfavourite();
    } else {
      handleFavourite();
    }
  };

  const handleFavourite = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/favourite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          type === 'note'
            ? { notesId: itemId }
            : { assignmentsId: itemId }
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      setIsFavorited(true);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfavourite = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/favourite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          type === 'note'
            ? { notesId: itemId }
            : { assignmentsId: itemId }
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      setIsFavorited(false);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={handleFavouriteClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </span>
        ) : isFavorited ? (
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Remove Favourites
          </span>
        ) : (
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Add Favourites
          </span>
        )}
      </Button>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in to add items to your favourites
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => signIn()}>
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Favourite;