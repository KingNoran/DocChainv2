import { auth } from '@/auth';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { db } from '@/database/drizzle';
import { transactions, users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import React, { ReactNode } from 'react';


const Layout = async ({children}:{children:ReactNode}) => {
  const session = await auth();

  if (!session) redirect("/login");

  after(async ()=> {
    if(!session?.user?.id) return;

    await db.update(users)
      .set({
        lastActivityDate: new Date().toISOString().slice(0, 10)
      })
      .where(eq(users.userId, session?.user?.id));
  });

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
