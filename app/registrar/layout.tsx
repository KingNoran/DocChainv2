import { auth } from '@/auth';
import RegistrarSideBar from '@/components/registrar/SideBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const layout = async ({children}:{children: ReactNode}) => {

  const session = await auth();

  if(!session) redirect("/");

  if(session.user.role !== "REGISTRAR"){
    if(session.user.role === "STUDENT") redirect("my-profile");
    if(session.user.role === "ADMIN") redirect("/admin");
  }

  return (
    <SidebarProvider >
      <RegistrarSideBar session={session!}/>
      <main className="flex min-h-screen w-full flex-col items-start px-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout
