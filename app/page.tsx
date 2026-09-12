'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DiseaseCard } from '@/components/DiseaseCard'
import { LogOut, Plus, Search, Stethoscope, X } from 'lucide-react'

interface Disease {
  id: string
  disease_name: string
  disease_tags: string[]
  dim1_clinical_signatures: string
  dim2_targeted_hx_pe: string
  dim3_investigations: string
  dim4_management: string
  dim5_education: string
}

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  const [diseases, setDiseases] = useState<Disease[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  useEffect(() => {
    async function fetchDiseases() {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('disease_name', { ascending: true })

      if (error) {
        console.error('Error fetching diseases:', error)
      } else {
        setDiseases(data || [])
      }
      setLoading(false)
    }
    fetchDiseases()
  }, [])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    diseases.forEach((d) => d.disease_tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [diseases])

  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) => {
      const matchesQuery = d.disease_name.toLowerCase().includes(query.toLowerCase())
      const matchesTags =
        activeTags.length === 0 || activeTags.every((tag) => d.disease_tags?.includes(tag))
      return matchesQuery && matchesTags
    })
  }, [diseases, query, activeTags])

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-zinc-900 dark:text-zinc-100" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              IMKB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/add')}
              size="sm"
              className="h-9 gap-1.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Add Disease</span>
            </Button>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </header>

      {/* Sticky search + filter */}
      <div className="sticky top-14 z-20 border-b border-zinc-200 bg-zinc-50/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" strokeWidth={1.75} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search disease name…"
              className="h-11 border-zinc-200 pl-9 text-sm dark:border-zinc-800"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const active = activeTags.includes(tag)
                return (
                  <Badge
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    variant={active ? 'default' : 'outline'}
                    className={`cursor-pointer select-none rounded-full px-3 py-1 text-xs transition-colors ${
                      active
                        ? 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    {tag}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <p className="py-20 text-center text-sm text-zinc-400">กำลังโหลดข้อมูล...</p>
        ) : filteredDiseases.length === 0 ? (
          <p className="py-20 text-center text-sm text-zinc-400">
            {diseases.length === 0
              ? 'ยังไม่มีข้อมูลโรคในระบบ'
              : 'No diseases match your search.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}