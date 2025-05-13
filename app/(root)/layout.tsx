import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';


const Layout = async ({children}:{children:ReactNode}) => {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <main className="root-container">
        <div className="flex flex-col mt-8 justify-between h-[100vh]">
          <Header />

            <div className="mt-20 pb-20">
                {children}
            </div>

          <Footer />
        </div>
    </main>
  );
}

export default Layout;
