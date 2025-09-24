import { auth } from '@/auth';
import AdminSidebar from '@/components/admin/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const Layout = async ({ children } : { children: ReactNode }) => {

  const session = await auth();

  if(!session) redirect("/");

  if(session.user.role !== "ADMIN"){
    if(session.user.role === "STUDENT")redirect("/my-profile");
    if(session.user.role === "REGISTRAR")redirect("/registrar");
  
  }

  return (
     <SidebarProvider >
      <AdminSidebar session={session!} />
      <main className="flex min-h-screen w-full flex-col items-start px-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
