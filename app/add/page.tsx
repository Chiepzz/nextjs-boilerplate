'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DiseaseCard } from '@/components/DiseaseCard'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'

interface DiseasePayload {
  disease_name: string
  disease_tags: string[]
  dim1_clinical_signatures: string
  dim2_targeted_hx_pe: string
  dim3_investigations: string
  dim4_management: string
  dim5_education: string
}

const REQUIRED_FIELDS: (keyof DiseasePayload)[] = [
  'disease_name',
  'disease_tags',
  'dim1_clinical_signatures',
  'dim2_targeted_hx_pe',
  'dim3_investigations',
  'dim4_management',
  'dim5_education',
]

export default function AddDiseasePage() {
  const router = useRouter()
  const supabase = createClient()

  const [rawJson, setRawJson] = useState('')
  const [parsed, setParsed] = useState<DiseasePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handlePreview = () => {
    setError(null)
    setParsed(null)

    try {
      const data = JSON.parse(rawJson)

      const missing = REQUIRED_FIELDS.filter((field) => !(field in data))
      if (missing.length > 0) {
        setError(`Missing required field(s): ${missing.join(', ')}`)
        return
      }
      if (!Array.isArray(data.disease_tags)) {
        setError('"disease_tags" must be an array of strings.')
        return
      }

      setParsed(data as DiseasePayload)
    } catch (e) {
      setError('Invalid JSON. Check for trailing commas or unescaped quotes.')
    }
  }

  const handleSave = async () => {
    if (!parsed) return
    setSaving(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Session expired. Please log in again.')
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('diseases').insert({
      ...parsed,
      user_id: user.id,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button
            onClick={() => router.push('/')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            Add Disease
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
        {/* Input column */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-zinc-500">Paste disease JSON</label>
          <Textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder={`{\n  "disease_name": "...",\n  "disease_tags": ["...", "..."],\n  "dim1_clinical_signatures": "...",\n  "dim2_targeted_hx_pe": "...",\n  "dim3_investigations": "...",\n  "dim4_management": "...",\n  "dim5_education": "..."\n}`}
            className="h-[420px] resize-none border-zinc-200 font-mono text-xs leading-relaxed dark:border-zinc-800"
          />

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="flex-1 gap-1.5 border-zinc-300 dark:border-zinc-700"
            >
              <Eye className="h-4 w-4" strokeWidth={1.75} />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={!parsed || saving}
              className="flex-1 gap-1.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" strokeWidth={1.75} />
              )}
              Save to Knowledge Base
            </Button>
          </div>
        </div>

        {/* Preview column */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-zinc-500">Live preview</label>
          {parsed ? (
            <DiseaseCard disease={{ id: 'preview', ...parsed }} />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
              <p className="text-sm text-zinc-400">Preview will render here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}