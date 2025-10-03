"use client";
import React from 'react'
import { useRouter } from "next/navigation";
import { NavItem } from './NabLink';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
// import { Moon, Sun } from "lucide-react"
const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]

  const Sun = dynamic(() =>
  import("lucide-react").then((mod) => mod.Sun)
, { ssr: false });
  const Moon = dynamic(() =>
  import("lucide-react").then((mod) => mod.Moon)
, { ssr: false });

function Navbar() {
    const { setTheme, theme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }
    const router = useRouter();
    const handleSubmit = () => {
        const auth = localStorage.getItem("auth");
        if (auth === "true") {
            router.push("/dashboard");
        } else {
          router.push("/login");
        }
      };
  return (
    <div  >
        <div className='bg-background text-foreground border-b'>

      <div className='base py-7 flex items-center justify-between'>
        <div className='text-2xl font-bold'>Logo</div>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavItem key={l.href} href={l.href} label={l.label} />
          ))}
        </div>
        <div className='flex items-center gap-1.5'>
            <Button variant='outline' onClick={handleSubmit}>Login</Button>
            <Button variant='outline' >Sign Up</Button>
            <Button size='icon' variant='outline' onClick={toggleTheme} > {theme === "dark" ? <Sun /> : <Moon />}</Button>

        </div>
      </div>
        </div>
    </div>
  )
}

export default Navbar
