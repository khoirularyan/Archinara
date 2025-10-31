"use client";

import { Toaster } from "sonner";

export default function ClientToaster() {
  return (
    <Toaster 
      richColors 
      closeButton 
      position="top-right"
      expand={false}
      duration={4000}
    />
  );
}
