"use client";

import Link from 'next/link'
import React, { useState, useEffect, ReactNode } from 'react'
import { redirect, usePathname} from "next/navigation";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ModeToggle } from './ui/toggle-mode';

import BurgerMenu from './BurgerMenu';
import { navItems, navItemsPaths } from '@/app/constants/navItems';
import { signOut } from '@/auth';

const Header = () => {

    const pathname = usePathname();
    

  return (
    <header className={cn("header-container",
      navItemsPaths.includes(pathname) ? "flex" : "hidden md:flex",
    )}>
      {/* The section below renders left-side nav */}
      <ul className="nav-container relative">
        { navItemsPaths.includes(pathname) ? 
        
        navItems.map(item=>{
          return(<li key={item.name}>
            <Link 
            href={item.path}
            className={cn("text-base cursor-pointer capitalize hidden md:block",
                pathname===`${item.path}` ? "active" : "",
              )}>
              {item.name}
            </Link>
          </li>)
        })  
        : null}

      </ul>
      {/* The section below renders right-side nav */}
      <div className="flex-row items-center flex">
        {navItemsPaths.includes(pathname) 
        ?  
        <div className='flex gap-10'>
          {/* Theme Toggle */}
          <div><ModeToggle /></div>
          {/* Logout Button */}
          
        </div>
        : null}
        { pathname==="/" ? 
        <div className="flex gap-4">
          <div><ModeToggle /></div>
          <Button className="cursor-pointer" onClick={()=>redirect("/login")}>Log In</Button> 
          <Button className="cursor-pointer bg-background hidden md:block" 
          onClick={()=>redirect("/docs")} 
          variant="secondary">Get Started</Button>
        </div>
        : null}
        {
          navItemsPaths.includes(pathname)
          
          ?
          
          <BurgerMenu />

          : null
        }
      </div>
    </header>
  )
}

export default Header
