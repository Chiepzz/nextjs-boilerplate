'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function Home() {
  const [diseases, setDiseases] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchDiseases() {
      const { data, error } = await supabase.from('diseases').select('*')
      if (error) {
        console.error('Error fetching diseases:', error)
      } else {
        setDiseases(data || [])
      }
    }
    fetchDiseases()
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F3EC] p-6 md:p-12 text-[#232220]">
      <div className="max-w-4xl mx-auto">
        <header className="border-b-2 border-[#232220] pb-5 mb-8 flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#5C5A54] mb-1">Clinical Reference System</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Personal Medical Knowledge Base</h1>
          </div>
          <span className="text-sm text-[#5C5A54]">{diseases.length} disease(s)</span>
        </header>

        <div className="space-y-6">
          {diseases.length === 0 ? (
            <p className="text-[#5C5A54] text-center py-12">กำลังโหลดข้อมูล หรือยังไม่มีข้อมูลโรคในระบบ</p>
          ) : (
            diseases.map((d) => (
              <Card key={d.id} className="bg-white border-[#E4E0D4] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold mb-2">{d.disease_name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {d.disease_tags?.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-[#ECE9E0] text-[#5C5A54]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                  
                  {/* Dimension 1: เปิดโชว์เป็น Default เสมอ */}
                  <div className="p-4 bg-[#E7EFEF] rounded-md border-l-4 border-[#2C5F6F]">
                    <h3 className="font-semibold text-[#2C5F6F] mb-1">01. Clinical Signatures</h3>
                    <p className="whitespace-pre-line text-[#232220]">{d.dim1_clinical_signatures}</p>
                  </div>

                  {/* Dimension 2-5: พับเก็บได้ด้วย Accordion */}
                  <Accordion className="w-full">
                    
                    <AccordionItem value="dim2" className="border-[#E4E0D4]">
                      <AccordionTrigger className="text-[#2C5F6F] hover:no-underline font-semibold">
                        02. Targeted Hx & High-Yield PE
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-[#232220] pt-2">{d.dim2_targeted_hx_pe}</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="dim3" className="border-[#E4E0D4]">
                      <AccordionTrigger className="text-[#2C5F6F] hover:no-underline font-semibold">
                        03. Make-or-Break Investigations
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-[#232220] pt-2">{d.dim3_investigations}</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="dim4" className="border-[#E4E0D4]">
                      <AccordionTrigger className="text-[#2C5F6F] hover:no-underline font-semibold">
                        04. Stepwise Management Plan
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-[#232220] pt-2">{d.dim4_management}</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="dim5" className="border-[#E4E0D4]">
                      <AccordionTrigger className="text-[#2C5F6F] hover:no-underline font-semibold">
                        05. Patient Education & Advice
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-[#232220] pt-2">{d.dim5_education}</p>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>

                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}