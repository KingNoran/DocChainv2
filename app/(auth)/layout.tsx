import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {ReactNode} from 'react'

const Layout = async ({children}:{children:ReactNode}) => {
  const session = await auth();

  if(session) redirect("/my-profile");
  
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3">
            <h1 className="text-2xl font-bold text-white">DocChain</h1>
          </div>
          <div>
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Layout
