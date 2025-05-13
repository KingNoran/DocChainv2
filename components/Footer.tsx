import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="footer-container">
        <section>
            <div className="flex items-center">
                <p>Empowering educational institutions and students with blockchain-based credential verification.</p>
            </div>
            <div>
                <ul>
                    <li className="font-bold pb-3">Company</li>
                    <li>
                        <Link href="/docs/about-us">About Us</Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li className="font-bold pb-3">Resources</li>
                    <li>
                        <Link href="/docs">Documentation</Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li className="font-bold pb-3">Legal</li>
                    <li>
                        <Link href="/docs/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link href="/docs/tos">Terms of Service</Link>
                    </li>
                    <li>
                        <Link href="/docs/cookies">Cookie Policy</Link>
                    </li>
                </ul>
            </div>
        </section>
        <div className='bg-primary min-w-90 max-w-7xl h-0.5'>

        </div>
        <p className="py-7 self-start">&#xA9; 2024 DocChain. </p>
        
    </footer>
  )
}

export default Footer
