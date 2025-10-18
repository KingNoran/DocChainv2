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
} from "@/components/ui/sidebar"
import { studentSidebarLinks } from "@/app/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Session } from "next-auth";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/logout";
import { Button } from "./ui/button";

const StudentSideBar = ({session} : {session : Session}) => {

  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center my-5">
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name!) || "IN"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-bold text-center">{session.user.name}</p>
          <p className="text-muted-foreground text-center">{session.user.email}</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> Student </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
              {studentSidebarLinks.map((item)=>{

                const isSelected = pathname === item.url;

                return(
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={cn("link", isSelected && "bg-primary shadow-sm")}>
                      <Link href={item.url} className={cn(isSelected ? 'text-white font-bold' : 'text-dark')}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <form action={logout}>
                    <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <form 
              className="flex justify-center"
              action={async () => {
                "use server";
      
                await signOut();
              }}
            >
                <Button className='cursor-pointer' variant="destructive">Logout</Button>
            </form>
      </SidebarFooter> */}
    </Sidebar>
  )
}

export default StudentSideBar
