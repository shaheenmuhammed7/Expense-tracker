"use client";
import { useState, useEffect } from "react";

export type UserProfile = {
  name: string;
  email: string;
};

export function useUser() {
  const [user, setUserState] = useState<UserProfile>({ 
    name: "Demo User", 
    email: "user@lumina.ai" 
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial Load
    const loadUser = () => {
      const saved = localStorage.getItem("lumina_user");
      if (saved) {
        try {
          setUserState(JSON.parse(saved));
        } catch (e) {}
      }
    };
    
    loadUser();

    // Listen for custom event updates across the app (so Sidebar syncs instantly)
    window.addEventListener("lumina_user_updated", loadUser);
    return () => window.removeEventListener("lumina_user_updated", loadUser);
  }, []);

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    localStorage.setItem("lumina_user", JSON.stringify(newUser));
    // Trigger the event so other components re-render
    window.dispatchEvent(new Event("lumina_user_updated"));
  };

  return { user, setUser, mounted };
}
