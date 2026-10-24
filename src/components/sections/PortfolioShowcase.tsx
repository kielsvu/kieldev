'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'
import TechStackIcon from './TechStackIcon'

/* ── Shared spring presets ────────────────────────────────────────────────── */
const sp  = { type: 'spring' as const, bounce: 0,    duration: 0.55 }
const spB = { type: 'spring' as const, bounce: 0.12, duration: 0.45 } // slight bounce for cards

const tabContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
}

const cardVariants = {
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
}

const techVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

const previewImgVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 10 },
}

const seeMoreLabelVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
}

const TABS = ['projects', 'techstack'] as const
type Tab = typeof TABS[number]
const TAB_LABELS: Record<Tab, string> = { projects: 'Projects', techstack: 'Tech Stack' }

export default function PortfolioShowcase() {
  const { projects, techStacks, loading } = usePortfolio()
  const [activeTab, setActiveTab]         = useState<Tab>('projects')
  const [previewOpen, setPreviewOpen]     = useState(false)
  const [previewImage, setPreviewImage]   = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)
  /* Hover guard — whileHover only fires for mouse, not touch */
  const [hasHover, setHasHover]           = useState(false)

  useEffect(() => {
    setHasHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  const displayedProjects = useMemo(
    () => (showAllProjects ? projects : projects.slice(0, 3)),
    [showAllProjects, projects]
  )

  const handleTabClick  = useCallback((tab: Tab) => {
    setActiveTab(tab)
    if (tab !== 'projects') setShowAllProjects(false)
  }, [])

  const closePreview   = useCallback(() => setPreviewOpen(false), [])
  const toggleShowAll  = useCallback(() => setShowAllProjects(v => !v), [])

  return (
    <>
      {/* ── Full-screen image preview ── */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={sp}
            className="fixed inset-0 z-[999] bg-black/92 flex items-center justify-center px-6"
          >
            <button
              onClick={closePreview}
              aria-label="Close preview"
              className="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center transition"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <X size={18} />
            </button>

            <motion.img
              variants={previewImgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sp}
              src={previewImage}
              alt="Project preview"
              decoding="async"
              loading="lazy"
              className="max-w-[88vw] max-h-[88vh] rounded-3xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="portfolio"
        className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-white"
      >
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...sp, duration: 0.65 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Portfolio Showcase</h1>
          <p className="text-white/55 max-w-xl mx-auto text-sm md:text-base">
            Explore my journey through projects and technical expertise.
          </p>
        </motion.div>

        {/* ── Tab bar — glass pill ── */}
        <div className="flex justify-center mb-10">
          <div
            className="w-full max-w-3xl rounded-full p-2 flex gap-2"
            style={{
              /* Same glass pattern as Navbar — saturate adds real depth */
              backdropFilter: 'blur(12px) saturate(160%)',
              WebkitBackdropFilter: 'blur(12px) saturate(160%)',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)',
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className="flex-1 rounded-full py-3 text-sm transition-all duration-300"
                style={{
                  background: activeTab === tab ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color:      activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
                  boxShadow:  activeTab === tab ? 'inset 0 1px 0 rgba(255,255,255,0.12)' : 'none',
                }}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={sp}
          >
            {/* Projects grid */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                  <AnimatePresence mode="popLayout">
                    {!loading && displayedProjects.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ ...spB, delay: i * 0.05 }}
                      >
                        <PortfolioCard
                          title={item.title}
                          description={item.description}
                          image={item.image_url}
                          live_url={item.live_url}
                          id={item.id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {!loading && projects.length > 3 && (
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={hasHover ? { scale: 1.04, transition: { type: 'spring', bounce: 0.2, duration: 0.25 } } : undefined}
                      whileTap={{ scale: 0.96, transition: { type: 'spring', bounce: 0, duration: 0.15 } }}
                      onClick={toggleShowAll}
                      className="px-6 rounded-full text-sm flex items-center gap-2"
                      style={{
                        /* Minimum 44px touch target */
                        minHeight: 44,
                        padding: '0 24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.75)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showAllProjects ? 'less' : 'more'}
                          variants={seeMoreLabelVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          {showAllProjects
                            ? <><ChevronUp   size={16} />See Less</>
                            : <><ChevronDown size={16} />See More</>
                          }
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* Tech stack grid */}
            {activeTab === 'techstack' && (
              <div className="min-h-[360px] flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
                  {!loading && techStacks?.map((item, index) => (
                    <TechCard key={item.id} item={item} index={index} hasHover={hasHover} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}

/* ── TechCard — glass via gradient, NO backdrop-filter ───────────────────── */
/* 22 cards × backdrop-filter = significant GPU spike on scroll.             */
/* Gradient + inset highlight achieves the glass look at zero blur cost.     */
function TechCard({
  item,
  index,
  hasHover,
}: {
  item: { id: string | number; name: string; logo_key?: string }
  index: number
  hasHover: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={techVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ ...sp, duration: 0.4, delay: index * 0.035 }}
      whileHover={hasHover ? { y: -5, transition: { type: 'spring', bounce: 0.2, duration: 0.3 } } : undefined}
      whileTap={{ scale: 0.96, transition: { type: 'spring', bounce: 0, duration: 0.15 } }}
      onHoverStart={() => hasHover && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group rounded-[24px] flex flex-col items-center justify-center gap-3 h-[110px] sm:h-[125px] w-full max-w-[125px] mx-auto"
      style={{
        /* Gradient simulates glass catch without backdrop-filter GPU cost */
        background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 10px rgba(0,0,0,0.18)',
      }}
    >
      <div className="relative flex items-center justify-center [--tech-icon-bg:#080808]">
        {hovered && (
          <div className="absolute w-[60px] h-[60px] rounded-full bg-white/15 blur-xl" />
        )}
        <TechStackIcon
          name={item.logo_key || item.name}
          className="relative z-10 w-[52px] h-[52px] text-white"
          aria-label={item.name}
        />
      </div>
      <p className="text-[11px] text-white/80 text-center leading-tight px-2 line-clamp-1">
        {item.name}
      </p>
    </motion.div>
  )
}
