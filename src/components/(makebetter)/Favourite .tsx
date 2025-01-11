import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Star, Loader2, Heart, HeartOff } from 'lucide-react';
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

  useEffect(() => {
    if (!session) return;

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
  className={`
    relative group transition-all duration-300
    ${isFavorited 
      ? 'bg-pink-500 hover:bg-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
      : 'bg-white hover:bg-pink-50 text-gray-700 border border-gray-200 hover:border-pink-200 hover:text-pink-500'
    }
    rounded-full px-3 py-1 text-xs sm:text-sm w-full sm:w-auto
  `}
>
  {isLoading ? (
    <span className="flex items-center gap-1">
      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
      <span className="font-medium">Processing...</span>
    </span>
  ) : isFavorited ? (
    <span className="flex items-center gap-1">
      <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
      <span className="font-medium">Favorited</span>
    </span>
  ) : (
    <span className="flex items-center gap-1">
      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="font-medium">Favorites</span>
    </span>
  )}
</Button>



      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Please sign in to add this {type} to your favorites collection
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLoginModal(false)}
              className="flex-1 transition-colors hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => signIn()}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white transition-colors"
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Favourite;