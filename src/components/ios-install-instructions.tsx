'use client';

import { X, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface IOSInstallInstructionsProps {
  open: boolean;
  onClose: () => void;
}

export function IOSInstallInstructions({ open, onClose }: IOSInstallInstructionsProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install Kraftika App</DialogTitle>
          <DialogDescription>
            Add Kraftika to your home screen for quick access and a better experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Share className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Step 1</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tap the <strong>Share</strong> button at the bottom of your screen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Step 2</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Step 3</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tap <strong>"Add"</strong> in the top right corner
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> Once added, you can access Kraftika directly from your home screen, just like a native app!
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}





