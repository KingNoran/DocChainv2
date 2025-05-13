"use client";

import React from 'react'
import { Button } from './ui/button'
import { redirect, usePathname } from 'next/navigation'
import { ModeToggle } from './ui/toggle-mode';
import { Input } from './ui/input';
import SearchBar from './SearchBar';
import Link from 'next/link';



const Hero = () => {

  const pathname = usePathname();


  return (
    <section className="hero">
      <div className="flex flex-1 flex-col gap-5 items-center">
        <h1 className='text-center'>Doc. Chain</h1>
        <p className='text-muted-foreground text-center'>Verify Cavite State University TOR via public key</p>
        
        <SearchBar />
        
        <div className="flex justify-even gap-10 pt-10 md:hidden">
          { pathname==="/" ? <Button onClick={()=>redirect("/login")}>Log In</Button> : null}
          <div><ModeToggle /></div>
          <Button onClick={()=>redirect("/docs")} variant="secondary">Get Started</Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
