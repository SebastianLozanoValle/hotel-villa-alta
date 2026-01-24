"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import MenuSheet from './menu-sheet'
import { LanguageSelector } from './language-selector/LanguageSelector'
import { TranslatedText } from '../translation/TranslatedText'

interface NavbarProps {
  content: {
    menu: string;
    inicio: string;
    reserva: string;
    close: string;
  };
}

const Navbar = ({ content }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
    <div className='fixed top-0 left-0 right-0 z-10 text-white'>
      <nav className='flex items-center px-4 md:px-8 border-b border-slate-400'>
        <div className='flex flex-1 items-center'>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className='group flex items-center gap-2 md:gap-4 cursor-pointer hover:opacity-70 transition-opacity py-6 md:py-8'
          >
            <div className='flex flex-col gap-1.5'>
              <div className='w-6 md:w-8 h-px bg-white transition-all group-hover:w-4 md:group-hover:w-6'></div>
              <div className='w-4 md:w-5 h-px bg-white transition-all group-hover:w-6 md:group-hover:w-8'></div>
            </div>
            <span className='font-source tracking-[0.3em] text-[10px] md:text-xs uppercase font-medium'>
              <TranslatedText>{content.menu}</TranslatedText>
            </span>
          </button>
        </div>
        
        <div className='flex-1 flex justify-center items-center'>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Villa Alta Guest House" 
              width={180} 
              height={40} 
              className="h-8 md:h-12 w-auto object-contain" 
              priority
            />
          </Link>
        </div>
        
        <div className='flex gap-4 md:gap-10 items-center flex-1 justify-end'>
          <div className='hidden md:flex items-center gap-6 lg:gap-10'>
            <Link href="/" className='text-lg font-source hover:opacity-70 transition-opacity border-r border-slate-400 pr-10 py-8 font-light'>
              <TranslatedText>{content.inicio}</TranslatedText>
            </Link>
            <Link href="/" className='text-lg font-source hover:opacity-70 transition-opacity font-bold text-accent-rose'>
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
