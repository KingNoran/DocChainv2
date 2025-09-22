"use client";

import Link from 'next/link'
import React, { useState, useEffect, ReactNode } from 'react'
import { redirect, usePathname, useRouter} from "next/navigation";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ModeToggle } from './ui/toggle-mode';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

import BurgerMenu from './BurgerMenu';
import { navItems, navItemsPaths } from '@/app/constants/navItems';
import InfoCarousel from './carousel/InfoCarousel';

const Header = () => {

    const pathname = usePathname();
    const [showCarousel, setShowCarousel] = useState(false);
        const router = useRouter();
    
    
      const handleCarouselFinish = () => {
        setShowCarousel(false);
        router.push('/guest/transaction');
      };
    
    // Show only project name, theme toggle, and Get Started on /login
    if (pathname === "/login") {
      return (
        <header className="header-container flex">
          <div className="flex items-center">
            <span className="text-xl font-bold">DocChain</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <button onClick={() => setShowCarousel(true)} className="px-6 py-2 bg-emerald-400 rounded-lg text-black text-base font-medium hover:bg-emerald-500 transition-colors cursor-pointer">Get Started</button>
          </div>
        </header>
      );
    }

  // Notification dropdown content
  const statusList = [
    {
      icon: (
        <span className="flex items-center justify-center w-7 h-7 bg-muted rounded-md text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12.5L10.5 17L18 9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ),
      label: 'Account Verification',
      status: 'Verified',
      statusClass: 'text-primary',
    },
    {
      icon: (
        <span className="flex items-center justify-center w-7 h-7 bg-muted rounded-md text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H16M16 12L13 9M16 12L13 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ),
      label: 'TOR in Ledger',
      status: 'Pending',
      statusClass: 'text-muted-foreground',
    },
  ];

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
      <div className="flex-row items-center flex gap-4">
        {navItemsPaths.includes(pathname) 
        ?  
        <>
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full bg-primary hover:bg-emerald-500 transition-colors focus:outline-none">
                <Bell className="w-6 h-6 text-primary-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0">
              <DropdownMenuLabel className="flex items-center gap-2 text-base font-bold px-4 pt-4 pb-1">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 px-2 pb-2">
                {statusList.map((item) => (
                  <DropdownMenuItem key={item.label} className="flex items-center justify-between gap-4 bg-muted rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-base font-medium">{item.label}</span>
                    </div>
                    <span className={`text-base font-semibold ${item.statusClass}`}>{item.status}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Theme Toggle */}
          <div><ModeToggle /></div>
        </>
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
      {showCarousel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <InfoCarousel onFinish={handleCarouselFinish} />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
