'use client';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/toggle-mode';
import InfoCarousel from '@/components/carousel/InfoCarousel';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const Home = () => {
  const [showCarousel, setShowCarousel] = useState(false);
  const router = useRouter();
  const {data: session, status} = useSession();
  
  useEffect(()=>{
    if(status === "authenticated" && session){
      if(session.user.role === "STUDENT") router.replace("/my-profile");
      if(session.user.role === "REGISTRAR") router.replace("/registrar");
      if(session.user.role === "ADMIN") router.replace("/admin");
    }
  }, [status, router])


  const handleCarouselFinish = () => {
    setShowCarousel(false);
    router.push('/transaction');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-inter relative">
      {/* Custom Header */}
      <header className="w-full h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Logo placeholder or add your logo here */}
          <span className="text-xl font-bold">DocChain</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/login">
            <button className="px-6 py-2 rounded-lg border border-foreground text-foreground text-base font-medium hover:bg-foreground/10 transition-colors cursor-pointer">Log In</button>
          </Link>
          <button onClick={() => setShowCarousel(true)} className="px-6 py-2 bg-emerald-400 rounded-lg text-black text-base font-medium hover:bg-emerald-500 transition-colors cursor-pointer">Get Started</button>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-10 pb-25">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            DocChain: Secure Academic<br />Records on the Blockchain
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience the future of academic credential verification with our blockchain-powered platform that ensures tamper-proof and instantly verifiable records.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/transaction">
              <button className="px-8 py-4 bg-emerald-400 rounded-lg text-black text-lg font-medium hover:bg-emerald-500 transition-colors w-full md:w-auto cursor-pointer">View Transaction</button>
            </Link>
            <button onClick={() => setShowCarousel(true)} className="px-8 py-4 rounded-lg border border-foreground text-foreground text-lg font-medium cursor-pointer hover:bg-foreground/10 transition-colors w-full md:w-auto">Learn More</button>
          </div>
        </div>
      </main>
      <Footer />
      {/* Modal Overlay for Carousel */}
      {showCarousel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <InfoCarousel onFinish={handleCarouselFinish} />
          </div>
        </div>
      )}
    </div>
  );
} 

export default Home;