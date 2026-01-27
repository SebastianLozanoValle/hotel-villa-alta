"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import MenuSheet from './menu-sheet'
import { LanguageSelector } from './language-selector/LanguageSelector'
import { TranslatedText } from '../translation/TranslatedText'

interface NavbarProps {
  content: {
    menu: string;
    inicio: string;
    reserva: string;
    close: string;
    reseñas: string;
    nosotros: string;
  };
}

const Navbar = ({ content }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Detectar si estamos en una página con fondo claro (términos, etc.)
  const isLightPage = pathname?.includes('/terms') || pathname?.includes('/rnt')
  
  const textColor = isLightPage ? 'text-secondary' : 'text-white'
  const borderColor = isLightPage ? 'border-secondary/20' : 'border-slate-400'
  const bgColor = isLightPage ? 'bg-background/95 backdrop-blur-sm' : 'bg-transparent'

  return (
    <>
    <div className={`fixed top-0 left-0 right-0 z-10 ${textColor} ${bgColor}`}>
      <nav className={`flex items-center px-4 md:px-8 border-b ${borderColor}`}>
        <div className='flex flex-1 items-center'>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className='group flex items-center gap-2 md:gap-4 cursor-pointer hover:opacity-70 transition-opacity py-6 md:py-8'
          >
            <div className='flex flex-col gap-1.5'>
              <div className={`w-6 md:w-8 h-px ${isLightPage ? 'bg-secondary' : 'bg-white'} transition-all group-hover:w-4 md:group-hover:w-6`}></div>
              <div className={`w-4 md:w-5 h-px ${isLightPage ? 'bg-secondary' : 'bg-white'} transition-all group-hover:w-6 md:group-hover:w-8`}></div>
            </div>
            <span className='font-source tracking-[0.2em] text-sm uppercase font-light'>
              <TranslatedText>{content.menu}</TranslatedText>
            </span>
          </button>
        </div>
        
        <div className='flex-1 flex justify-center items-center'>
          <Link href={`/${pathname?.split('/')[1] || 'es'}`}>
            <Image 
              src="/logo.png" 
              alt="Villa Alta Guest House" 
              width={180} 
              height={40} 
              className={`h-8 md:h-12 w-auto object-contain ${isLightPage ? 'brightness-0' : ''}`}
              priority
            />
          </Link>
        </div>
        
        <div className='flex gap-4 md:gap-10 items-center flex-1 justify-end'>
          <div className='hidden md:flex items-center gap-6 lg:gap-10'>
            <Link href="/" className={`text-sm font-source tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-r ${borderColor} pr-10 py-8 font-light`}>
              <TranslatedText>{content.inicio}</TranslatedText>
            </Link>
            <Link href="/" className={`text-sm font-source tracking-[0.2em] uppercase hover:opacity-70 transition-opacity font-light ${isLightPage ? 'text-accent-rose' : 'text-accent-rose'}`}>
              <TranslatedText>{content.reserva}</TranslatedText>
            </Link>
          </div>
          <LanguageSelector />
        </div>
      </nav>
    </div>
    
    <MenuSheet 
      isOpen={isMenuOpen} 
      onClose={() => setIsMenuOpen(false)} 
      content={content}
    />
    </>
  )
}

export default Navbar
