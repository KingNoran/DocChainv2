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
      <div className="flex w-full h-screen bg-black">
      <AppSidebar session={session}/>
        <main className="flex flex-1 overflow-y-auto">
        {children}
      </main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
