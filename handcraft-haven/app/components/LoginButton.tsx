"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sellerId = localStorage.getItem("sellerId");
    setIsLoggedIn(!!sellerId);
    setIsLoading(false);
  }, []);

  function handleLogin() {
    // Store current page for redirect after login
    localStorage.setItem("redirectAfterLogin", pathname);
    router.push("/login");
  }

  function handleLogout() {
    localStorage.removeItem("sellerId");
    localStorage.removeItem("redirectAfterLogin");
    setIsLoggedIn(false);
    router.push("/");
  }

  if (isLoading) return null;

  return (
    <button 
      onClick={isLoggedIn ? handleLogout : handleLogin}
      style={{ padding: "0.5rem 1rem", background: "#000", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px" }}
    >
      {isLoggedIn ? "Log Out" : "Log In"}
    </button>
  );
}
