"use client";

import Link from 'next/link'
import { useState } from 'react'
import MenuSheet from './menu-sheet'
import { LanguageSelector } from '../common/language-selector'

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
              <div className='w-6 md:w-8 h-[1px] bg-white transition-all group-hover:w-4 md:group-hover:w-6'></div>
              <div className='w-4 md:w-5 h-[1px] bg-white transition-all group-hover:w-6 md:group-hover:w-8'></div>
            </div>
            <span className='font-source tracking-[0.3em] text-[10px] md:text-xs uppercase font-medium'>
              {content.menu}
            </span>
          </button>
        </div>
        
        <h1 className='text-lg md:text-2xl font-source flex-1 text-center whitespace-nowrap'>Hotel Villa Alta</h1>
        
        <div className='flex gap-4 md:gap-10 items-center flex-1 justify-end'>
          <div className='hidden md:flex items-center gap-10'>
            <Link href="/" className='text-lg font-source hover:opacity-70 transition-opacity border-r border-slate-400 pr-10 py-8 font-light'>
              {content.inicio}
            </Link>
            <Link href="/about" className='text-lg font-source hover:opacity-70 transition-opacity font-bold'>
              {content.reserva}
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
