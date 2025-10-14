import { auth } from '@/auth';
import { ThemeProvider } from '@/components/ThemeProvider';
import { redirect } from 'next/navigation';
import {ReactNode} from 'react'

const Layout = async ({children}:{children:ReactNode}) => {
  const session = await auth();
  
    if(session){
      if(session.user.role === "STUDENT") redirect("/student/my-profile");
      if(session.user.role === "REGISTRAR") redirect("/registrar");
      if(session.user.role === "ADMIN") redirect("/admin");
    }
    
  
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div>
            <ThemeProvider
                defaultTheme="light"
              >
            {children}
            </ThemeProvider>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Layout
