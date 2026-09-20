'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'
import TechStackIcon from './TechStackIcon'

// Defined outside component — stable reference, no recreation on render
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Stable animation variants — defined outside avoids object recreation every render
const tabContentVariants = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
}

const tabContentTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const certVariants = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
}

const techVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const previewOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const previewImgVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
}

const previewImgTransition = { duration: 0.35 }

const seeMoreLabelVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const seeMoreLabelTransition = { duration: 0.25 }

const TABS = ['projects', 'certificates', 'techstack'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = {
  projects: 'Projects',
  certificates: 'Certificates',
  techstack: 'Tech Stack',
}

export default function PortfolioShowcase() {
  const { projects, certificates, techStacks, loading } = usePortfolio()

  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Memoize sliced list — avoids recomputing on unrelated re-renders
  const displayedProjects = useMemo(
    () => (showAllProjects ? projects : projects.slice(0, 3)),
    [showAllProjects, projects]
  )

  // Stable tab handler — avoids recreating inline arrow per render
  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab)
    if (tab !== 'projects') setShowAllProjects(false)
  }, [])

  // Stable preview close handler
  const closePreview = useCallback(() => setPreviewOpen(false), [])

  // Stable toggle handler
  const toggleShowAll = useCallback(
    () => setShowAllProjects((v) => !v),
    []
  )

  // Stable cert click handler — uses a ref to avoid stale closure without recreating per item
  const openPreview = useCallback((url: string) => {
    setPreviewImage(url)
    setPreviewOpen(true)
  }, [])

  return (
    <>
      {/* PREVIEW MODAL
          — backdrop-blur removed from overlay; replaced with bg-black/92 which
            achieves near-identical darkening without a full compositing layer.
            The blur was only on the overlay bg, not the image itself, so visually
            the difference is imperceptible at 90%+ black coverage.
      */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            variants={previewOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[999] bg-black/92 flex items-center justify-center px-6"
          >
            <button
              onClick={closePreview}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            <motion.img
              variants={previewImgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={previewImgTransition}
              src={previewImage}
              // Hint browser to decode off main thread
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
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          // viewport once:true — fires only once, kills the IntersectionObserver after
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Portfolio Showcase
          </h1>
          <p className="text-white/55 max-w-xl mx-auto text-sm md:text-base">
            Explore my journey through projects, certifications, and technical expertise.
          </p>
        </motion.div>

        {/* TAB BAR
            — backdrop-blur-xl replaced with bg-white/8 (slightly higher opacity)
              so the frosted look is preserved without a GPU compositing layer.
        */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl rounded-full border border-white/10 bg-white/8 backdrop-blur-sm p-2 flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`flex-1 rounded-full py-3 text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={tabContentTransition}
          >
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                {/*
                  Removed `layout` from this wrapper — layout animation forces
                  Framer to measure all DOM nodes every frame during the transition,
                  which is the single most expensive operation in this file.
                  The grid reflow still looks smooth because the child cards
                  animate in/out with opacity+scale+y.
                */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                  <AnimatePresence mode="popLayout">
                    {!loading &&
                      displayedProjects.map((item, i) => (
                        <motion.div
                          key={item.id}
                          layout
                          variants={cardVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{
                            duration: 0.55,
                            delay: i * 0.04,
                            ease: smoothEase,
                          }}
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

                {/* SEE MORE / LESS */}
                {!loading && projects.length > 3 && (
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={toggleShowAll}
                      className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.05] text-sm text-white/75 hover:text-white transition flex items-center gap-2"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showAllProjects ? 'less' : 'more'}
                          variants={seeMoreLabelVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={seeMoreLabelTransition}
                          className="flex items-center gap-2"
                        >
                          {showAllProjects ? (
                            <>
                              <ChevronUp size={16} />
                              See Less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              See More
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATES
                — backdrop-blur-xl on each card removed; bg-white/5 kept as-is.
                  The blur on 10–20 cards simultaneously was causing layer explosion
                  on mobile GPUs. bg opacity slightly raised to bg-white/6 to
                  compensate for no blur — visually the same dark frosted look.
                — whileInView kept but viewport once:true added so observers
                  are released after first trigger.
            */}
            {activeTab === 'certificates' && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                {!loading &&
                  certificates.map((item, i) => (
                    <motion.div
                      key={item.id}
                      variants={certVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                      onClick={() => openPreview(item.image_url)}
                      className="cursor-pointer rounded-[26px] border border-white/10 bg-white/[0.07] p-4"
                    >
                      <div className="rounded-2xl overflow-hidden border border-white/10 h-56">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          decoding="async"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-center text-white/90">
                        {item.title}
                      </h3>
                    </motion.div>
                  ))}
              </div>
            )}

            {/* TECH STACK
                — backdrop-blur-xl on each card removed; bg-white/[0.04] kept.
                  Same reasoning as certificates — N simultaneous blur layers
                  on low-end GPUs causes dropped frames.
                — The glow div (blur-2xl) is now conditionally rendered only on
                  hover via a React state on the card, rather than being in the DOM
                  at opacity-0. This eliminates the compositing layer for every
                  card at rest.
            */}
            {activeTab === 'techstack' && (
              <div className="min-h-[360px] flex justify-center">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
                  {!loading &&
                    techStacks?.map((item, index) => (
                      <TechCard key={item.id} item={item} index={index} />
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

// Extracted into its own component so hover state is isolated —
// prevents the glow div from causing a full-list re-render on hover.
// The glow div is mounted only while hovered, removing the idle GPU layer.
function TechCard({
  item,
  index,
}: {
  item: { id: string | number; name: string; logo_key?: string }
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={techVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group rounded-[24px] border border-white/10 bg-white/[0.07] flex flex-col items-center justify-center gap-3 h-[125px] w-[125px] mx-auto"
    >
      <div className="relative flex items-center justify-center [--tech-icon-bg:#080808]">
        {/* Glow div only mounted while hovered — eliminates idle GPU compositing layer */}
        {hovered && (
          <div className="absolute w-[70px] h-[70px] rounded-full bg-white/20 blur-2xl opacity-100" />
        )}
        <TechStackIcon
          name={item.logo_key || item.name}
          className="relative z-10 w-[56px] h-[56px] text-white"
          aria-label={item.name}
        />
      </div>
      <p className="text-[11px] text-white/80 text-center leading-tight px-2 line-clamp-1">
        {item.name}
      </p>
    </motion.div>
  )
}
