'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Detect if device is iOS
function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Detect if browser is Safari
function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Detect if device is Android
function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

// Detect if device is mobile
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function usePWAInstall() {
  // Initialize installable state synchronously for iOS to avoid delayed rendering
  const isIOSDevice = typeof window !== 'undefined' ? isIOS() : false;
  const isInstalledCheck = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // Initialize isInstallable immediately for iOS (can be determined synchronously)
  // For other devices, wait for beforeinstallprompt event
  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (isInstalledCheck) return false;
    // iOS always supports manual install, so show button immediately
    return isIOSDevice;
  });
  const [isInstalled, setIsInstalled] = useState(isInstalledCheck);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (isIOSDevice) return 'ios';
    if (isAndroid()) return 'android';
    return 'desktop';
  });

  useEffect(() => {
    // Check if app is already installed (double-check on mount)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    // Detect device type (update if needed)
    if (isIOS()) {
      setDeviceType('ios');
      // For iOS, install option is already set in initial state
    } else if (isAndroid()) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Android/Chrome supports beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Set up listener immediately to catch the event as early as possible
    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, check if we should show instructions
    if (isIOS() && isMobile()) {
      // Check if user has dismissed iOS instructions
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) {
        // Show instructions after a delay
        setTimeout(() => {
          setShowIOSInstructions(true);
        }, 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    // iOS doesn't support programmatic install
    if (isIOS()) {
      setShowIOSInstructions(true);
      return false;
    }

    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const dismissIOSInstructions = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('ios-install-dismissed', Date.now().toString());
  };

  return {
    isInstallable,
    isInstalled,
    install,
    showIOSInstructions,
    dismissIOSInstructions,
    deviceType,
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
  };
}

