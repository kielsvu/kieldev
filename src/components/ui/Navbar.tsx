'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [isMobile, setIsMobile]         = useState(false)
  const [open, setOpen]                 = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted]           = useState(false)
  const [showNavbar, setShowNavbar]     = useState(false)

  useEffect(() => {
    setMounted(true)

    const onResize = () => setIsMobile(window.innerWidth < 768)

    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const ids = ['home', 'about', 'portfolio', 'contact']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (top <= 140 && bottom >= 140) { setActiveSection(id); break }
      }
    }

    onResize()
    onScroll()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const played = sessionStorage.getItem('navbarPlayed')
    if (played) { setShowNavbar(true); return }
    const t = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  /* Native smooth scroll — instant response, no RAF loop */
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.querySelector(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 3, behavior: 'smooth' })
    setOpen(false)
  }

  const navItems = [
    { label: 'Home',      id: 'home' },
    { label: 'About',     id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact',   id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -40 }}
      /* Spring — interruptible if nav re-mounts mid-flight */
      transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
      style={{ position: 'fixed', top: 20, left: isMobile ? 20 : 60, right: isMobile ? 20 : 60, zIndex: 50 }}
    >
      {/* ── Pill ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 24px',
          borderRadius: 999,
          /* Apple frosted-glass: saturate gives depth, blur kills detail */
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: scrolled ? 'rgba(13,13,13,0.82)' : 'rgba(13,13,13,0.55)',
          /* Light-catching top edge — the signature Apple chrome detail */
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 24px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'background-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em' }}>
          kiel.dev
        </span>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 40 }}>
            {navItems.map(({ label, id }) => {
              const active = activeSection === id
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => scrollTo(e, `#${id}`)}
                  style={{
                    position: 'relative',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    letterSpacing: '0.08em',
                    paddingBottom: 4,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {label}
                  {/* Underline — Apple-style slide-in indicator */}
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                    background: 'white',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.25s ease',
                  }} />
                </a>
              )
            })}
          </div>
        )}

        {/* Hamburger — proper <button> for keyboard / a11y */}
        {isMobile && (
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'white',
              /* 44×44 minimum touch target */
              minWidth: 44, minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.25 }}><X size={18} /></motion.span>
                : <motion.span key="m" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.25 }}><Menu size={18} /></motion.span>
              }
            </AnimatePresence>
          </button>
        )}
      </div>

      {/* ── Mobile drawer — spring so it's interruptible mid-flight ── */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
            style={{
              marginTop: 10,
              borderRadius: 20,
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              backgroundColor: 'rgba(13,13,13,0.88)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.4)',
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {navItems.map(({ label, id }, i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollTo(e, `#${id}`)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3, delay: i * 0.05 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14,
                  color: activeSection === id ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  padding: '14px 20px',
                  borderRadius: 12,
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
