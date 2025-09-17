"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // If already logged in → redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  function handleLogin(e) {
    e.preventDefault();

    // 🔒 Static Credentials
    if (username === "admin" && password === "1234") {
      localStorage.setItem("auth", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg border  border-neutral-300  p-6 rounded-lg flex flex-col space-y-4 w-full max-w-96"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-neutral-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-neutral-300 p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
