import { auth } from '@/auth'
import AppSidebar from '@/components/admin/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { db } from '@/database/drizzle';
import { admins, users } from '@/database/schema';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'
import { eq } from 'drizzle-orm';

const Layout = async ({ children } : { children: ReactNode }) => {
  const session = await auth();

  if(!session?.user?.id) redirect("/login");
  
  const user = await db.select().from(users)
  const admin = await db.select().from(admins).where(eq(admins.userId, user[0].userId))
  const input = {...user[0], ...admin[0]}

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
