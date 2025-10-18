import { auth } from '@/auth';
import Footer from '@/components/Footer';
import StudentSideBar from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/");

  if (session.user.role !== "STUDENT") {
    if (session.user.role === "ADMIN") redirect("/admin");
    if (session.user.role === "REGISTRAR") redirect("/registrar");
  }

  return (
    <SidebarProvider>
      <StudentSideBar session={session} />
      <div className="student-theme">
        <main className="root-container">
          
          <div className="flex flex-col mt-8 justify-between h-[100vh]">
            <div className="pb-20">
              <SidebarTrigger className="w-10 h-10 p-2 text-xl" />
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
