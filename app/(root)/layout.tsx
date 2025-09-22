
import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';


const Layout = async ({children}:{children:ReactNode}) => {
  const session = await auth();

  if(!session) redirect("/");

  if(session.user.role !== "STUDENT"){
    if(session.user.role === "ADMIN") redirect("/admin");
    if(session.user.role === "REGISTRAR") redirect("/registrar");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
    >
    <main className="root-container">
        <div className="flex flex-col mt-8 justify-between h-[100vh]">
          <Header />

            <div className="mt-20 pb-20">
                  
                {children}
                
            </div>

          <Footer />
        </div>
    </main>
    </ThemeProvider>
  );
}

export default Layout;
