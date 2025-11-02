import React, { useEffect, useRef } from 'react';

interface SignInButtonProps {
  onSuccess: (userJsonUrl: string) => void;
  clientId?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({ 
  onSuccess, 
  clientId = "15695407177920574360" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the external script
    const script = document.createElement('script');
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    containerRef.current.appendChild(script);

    // Define the listener function
    window.phoneEmailListener = function(userObj: { user_json_url: string }) {
      const userJsonUrl = userObj.user_json_url;
      
      // Call the success callback with the user_json_url
      onSuccess(userJsonUrl);
    };

    return () => {
      // Cleanup the listener function when the component unmounts
      window.phoneEmailListener = null;
      
      // Remove script if it exists
      if (containerRef.current && script.parentNode) {
        containerRef.current.removeChild(script);
      }
    };
  }, [onSuccess]);

  return (
    <div ref={containerRef} className="pe_signin_button" data-client-id={clientId}></div>
  );
};

// Extend Window interface to include phoneEmailListener
declare global {
  interface Window {
    phoneEmailListener?: (userObj: { user_json_url: string }) => void;
  }
}

export default SignInButton;

