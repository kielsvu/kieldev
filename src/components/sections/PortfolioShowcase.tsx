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

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

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

const TABS = ['projects', 'techstack'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = {
  projects: 'Projects',
  techstack: 'Tech Stack',
}

export default function PortfolioShowcase() {
  const { projects, techStacks, loading } = usePortfolio()

  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)

  const displayedProjects = useMemo(
    () => (showAllProjects ? projects : projects.slice(0, 3)),
    [showAllProjects, projects]
  )

  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab)
    if (tab !== 'projects') setShowAllProjects(false)
  }, [])

  const closePreview = useCallback(() => setPreviewOpen(false), [])

  const toggleShowAll = useCallback(
    () => setShowAllProjects((v) => !v),
    []
  )

  return (
    <>
      {}
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
        {}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Portfolio Showcase
          </h1>
          <p className="text-white/55 max-w-xl mx-auto text-sm md:text-base">
            Explore my journey through projects and technical expertise.
          </p>
        </motion.div>

        {}
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
            {}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                {}
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

                {}
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
            {}
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
        {}
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
