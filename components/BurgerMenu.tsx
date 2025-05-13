import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { navItems } from '@/app/constants/navItems';
import { redirect, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const BurgerMenu = () => {
    const pathname = usePathname();

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="cursor-pointer flex md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {
                navItems.map((item)=>{
                    return(
                        <DropdownMenuItem key={item.name} onClick={()=>redirect(`${item.path}`)} className="cursor-pointer">
                            <div 
                                className={cn("capitalize", 
                                    pathname===`${item.path}`
                                    ? "active"
                                    : ""
                                )}>
                                {item.name}
                            </div>
                        </DropdownMenuItem>
                    )
                })
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>{}} className="cursor-pointer">
                <div>Log Out</div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BurgerMenu


/* 

<DropdownMenuItem onClick={()=>{}}>
            Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{}}>
            Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{}}>
            Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{}}>
            TOR
            </DropdownMenuItem>
*/