'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  title: string
  description: string
  id?: string
  image?: string
  live_url?: string
}

export default function PortfolioCard({ title, description, id, image, live_url }: Props) {
  /* Only enable whileHover on true pointer devices — not touch screens */
  const [hasHover, setHasHover] = useState(false)
  useEffect(() => {
    setHasHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  return (
    <motion.div
      whileHover={hasHover ? { y: -5, transition: { type: 'spring', bounce: 0.2, duration: 0.35 } } : undefined}
      whileTap={{ scale: 0.985, transition: { type: 'spring', bounce: 0, duration: 0.18 } }}
      className="group relative rounded-[26px] flex flex-col min-h-[270px] p-4"
      style={{
        /* Glass: small blur radius = much lower GPU cost than blur(20px) */
        backdropFilter: 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
        background: 'rgba(255,255,255,0.055)',
        border: '1px solid rgba(255,255,255,0.11)',
        /* Top-edge highlight = Apple "light catching the chrome" */
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.11), 0 8px 32px rgba(0,0,0,0.28)',
      }}
    >
      {/* Thumbnail */}
      <div className="w-full h-36 rounded-2xl overflow-hidden mb-3"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
        {image ? (
          <img
            src={image}
            alt={`${title} preview`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        )}
      </div>

      <h3 className="text-[17px] font-semibold mb-2 leading-tight">{title}</h3>

      <p className="text-[13px] leading-relaxed line-clamp-2 min-h-[38px]"
        style={{ color: 'rgba(255,255,255,0.6)' }}>
        {description}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between">
        {live_url ? (
          <a
            href={live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={e => hasHover && ((e.currentTarget as HTMLElement).style.color = 'white')}
            onMouseLeave={e => hasHover && ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          >
            Live Demo
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <div className="text-[13px]" style={{ color: 'rgba(255,255,255,0.38)' }}>No Link</div>
        )}
      </div>
    </motion.div>
  )
}
