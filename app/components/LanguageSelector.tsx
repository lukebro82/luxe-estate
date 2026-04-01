'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/app/actions/setLocale'

type Props = {
  currentLocale: string;
}

const locales = [
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'fr', label: '🇫🇷 Français' }
]

export default function LanguageSelector({ currentLocale }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (locale: string) => {
    setIsOpen(false)
    startTransition(async () => {
      await setLocale(locale)
      router.refresh()
    })
  }

  const currentSettings = locales.find((l) => l.code === currentLocale) || locales[0]

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-nordic-dark hover:text-mosque px-2 py-1 transition-colors text-sm font-medium ${isPending ? 'opacity-50' : ''}`}
        disabled={isPending}
        aria-label="Select Language"
      >
        <span className="material-icons text-sm">language</span>
        <span className="hidden md:inline text-[16px]">{currentSettings.label.split(' ')[0]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-nordic-dark/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleSelect(locale.code)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                currentLocale === locale.code ? 'font-medium text-mosque bg-gray-50/50' : 'text-nordic-dark/80'
              }`}
            >
              {locale.label}
              {currentLocale === locale.code && (
                <span className="material-icons text-[16px]">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
