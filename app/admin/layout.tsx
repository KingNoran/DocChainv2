import { auth } from '@/auth'
import AppSidebar from '@/components/admin/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const Layout = async ({ children } : { children: ReactNode }) => {
  const session = await auth();

  if(!session?.user?.id) redirect("/login");

  return (
     <SidebarProvider >
      <AppSidebar session={session}/>
      <main className="flex min-h-screen w-full flex-col items-start px-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
