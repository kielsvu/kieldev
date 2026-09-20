'use client'

import { useEffect, useState } from 'react'
import {
  certificates as localCertificates,
  projects as localProjects,
  techStacks as localTechStacks,
} from '@/lib/portfolioData'

export default function usePortfolio() {
  const [projects, setProjects] = useState(localProjects)
  const [certificates, setCertificates] = useState(localCertificates)
  const [techStacks, setTechStacks] = useState(localTechStacks)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProjects(localProjects)
    setCertificates(localCertificates)
    setTechStacks(localTechStacks)
    setLoading(false)
  }, [])

  return {
    projects,
    certificates,
    techStacks,
    loading,
  }
}
