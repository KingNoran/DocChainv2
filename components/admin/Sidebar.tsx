"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button";
import { signOut } from "@/auth";
import { adminSidebarLinks } from "@/app/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Session } from "next-auth";
import { logout } from "@/app/actions";

interface Admin{
  firstName: string;
  middleName: string | null;
  lastName: string;
}



const AppSidebar = ({session} : {session : Session}) => {

  const pathname = usePathname();

  return (
    <Sidebar className="w-72 h-full bg-zinc-900 border-r border-black">
      <SidebarHeader className="flex flex-col items-center my-6">
        {/* Placeholder for Avatar image - replace src with actual image */}
        <img className="w-20 h-20 rounded-full" src="https://placehold.co/80x80" alt="User Avatar" />
        <div className="flex flex-col items-center mt-4">
          <p className="font-semibold text-lg text-neutral-200 text-center">{session?.user?.name}</p>
          <p className="text-sm text-neutral-400 text-center">{session?.user?.email}</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* Removed 'Admin' group label as per image */}
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4 px-6">
              {adminSidebarLinks.map((item) => {
                const isSelected = (item.url !== "/admin" && pathname.includes(item.url)) || pathname === item.url;
                const Icon = item.icon; // Get the icon component

                // Handle the Exit button with a form for logout
                if (item.title === 'Exit') {
                  return (
                    <SidebarMenuItem key={item.title} className={cn("w-full rounded-lg", isSelected ? "bg-zinc-800" : "bg-transparent")}>
                      <form action={logout} className="w-full">
                        <SidebarMenuButton asChild>
                          <button type="submit" className={cn(
                            "flex items-center gap-3 w-full h-12 px-3",
                            'text-red-500' // Apply red color for Exit
                          )}>
                            {Icon && <Icon className={cn(
                              "w-5 h-5",
                              'outline outline-2 outline-offset-[-1px] outline-red-500' // Apply red outline for Exit
                            )} />}
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </form>
                    </SidebarMenuItem>
                  );
                }

                // Render other sidebar items
                return (
                  <SidebarMenuItem key={item.title} className={cn(
                    "w-full rounded-lg",
                    isSelected ? "bg-green-500" : "bg-transparent"
                  )}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={cn(
                        "flex items-center gap-3 w-full h-12 px-3",
                        isSelected ? 'text-white' : 'text-gray-400'
                      )}>
                        {Icon && <Icon className={cn(
                          "w-5 h-5",
                          isSelected ? "text-white" : "text-gray-400"
                        )} />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Removed SidebarFooter */}
    </Sidebar>
  )
}

export default AppSidebar
