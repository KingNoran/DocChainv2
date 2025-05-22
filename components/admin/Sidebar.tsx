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

interface Admin{
  firstName: string;
  middleName: string | null;
  lastName: string;
}



const AppSidebar = ({session} : {session : Session}) => {

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
          <p className="font-bold text-center">{session?.user?.name}</p>
          <p className="text-muted-foreground text-center">{session?.user?.email}</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> Registrar </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
              {adminSidebarLinks.map((item)=>{

                const isSelected = (item.url !== "/admin" && pathname.includes(item.url)) || pathname === item.url;

                return(
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={cn("link", isSelected && "bg-primary-admin shadow-sm")}>
                      <Link href={item.url} className={cn(isSelected ? 'text-white font-bold' : 'text-dark')}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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

export default AppSidebar
