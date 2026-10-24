'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Send, User, Mail, MessageSquare, CheckCircle } from 'lucide-react'

const sp = { type: 'spring' as const, bounce: 0, duration: 0.55 }

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0 },
}

const fieldTransition = { type: 'spring' as const, bounce: 0, duration: 0.5 }

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (loading || sent) return
    setLoading(true)
    /* Stub — replace with your actual form endpoint */
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={sp}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] p-5 md:p-8 flex flex-col"
      style={{
        /* Glass — consistent with PortfolioCard */
        backdropFilter: 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.28)',
      }}
    >
      <motion.div variants={fieldVariants} initial="hidden" whileInView="show"
        viewport={{ once: false }} transition={{ ...fieldTransition, delay: 0.05 }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact Me</h2>
        <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
          I'm always open to discussing new projects, collaboration opportunities and ideas.
          Feel free to get in touch.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Name */}
        <motion.div variants={fieldVariants} initial="hidden" whileInView="show"
          viewport={{ once: false }} transition={{ ...fieldTransition, delay: 0.10 }}>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2" size={16}
              style={{ color: 'rgba(255,255,255,0.4)' }} />
            <input
              placeholder="Your Name"
              aria-label="Your Name"
              className="w-full rounded-2xl pl-12 pr-4 py-4 outline-none transition duration-200
                focus:ring-1 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.13)', color: 'white' }}
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div variants={fieldVariants} initial="hidden" whileInView="show"
          viewport={{ once: false }} transition={{ ...fieldTransition, delay: 0.15 }}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16}
              style={{ color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="email"
              placeholder="Your Email"
              aria-label="Your Email"
              className="w-full rounded-2xl pl-12 pr-4 py-4 outline-none transition duration-200
                focus:ring-1 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.13)', color: 'white' }}
            />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div variants={fieldVariants} initial="hidden" whileInView="show"
          viewport={{ once: false }} transition={{ ...fieldTransition, delay: 0.20 }}>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-5" size={16}
              style={{ color: 'rgba(255,255,255,0.4)' }} />
            <textarea
              rows={5}
              placeholder="Your Message"
              aria-label="Your Message"
              className="w-full rounded-2xl pl-12 pr-4 py-4 outline-none resize-none transition duration-200
                focus:ring-1 focus:ring-white/40 focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.13)', color: 'white' }}
            />
          </div>
        </motion.div>

        {/* Send button — feedback on press (whileTap), NOT on hover */}
        <motion.div variants={fieldVariants} initial="hidden" whileInView="show"
          viewport={{ once: false }} transition={{ ...fieldTransition, delay: 0.25 }}>
          <motion.button
            whileTap={!sent && !loading
              ? { scale: 0.97, transition: { type: 'spring', bounce: 0, duration: 0.14 } }
              : undefined}
            onClick={handleSubmit}
            disabled={loading || sent}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors duration-200"
            style={{
              /* Minimum 44px height already satisfied by py-4 + text */
              background: sent ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09)',
              color: sent ? 'rgba(255,255,255,0.55)' : 'white',
              cursor: sent || loading ? 'default' : 'pointer',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span key="sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={sp}
                  className="flex items-center gap-2">
                  <CheckCircle size={16} /> Message sent
                </motion.span>
              ) : loading ? (
                <motion.span key="loading" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={sp}
                  className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                  Sending…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={sp}
                  className="flex items-center gap-2">
                  <Send size={16} /> Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Connect With Me</p>
        <a
          href="mailto:hello@kiel.dev"
          className="inline-flex items-center gap-1 rounded-2xl px-4 py-3 text-sm transition-colors duration-200"
          style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)' }}
        >
          Email <span style={{ color: 'rgba(255,255,255,0.35)' }}>↗</span>
        </a>
      </div>
    </motion.div>
  )
}
