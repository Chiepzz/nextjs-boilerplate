'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TextParser } from '@/components/TextParser'

interface DiseaseCardProps {
  disease: {
    id: string
    disease_name: string
    disease_tags: string[]
    dim1_clinical_signatures: string
    dim2_targeted_hx_pe: string
    dim3_investigations: string
    dim4_management: string
    dim5_education: string
  }
}

export function DiseaseCard({ disease }: DiseaseCardProps) {
  return (
    <Card className="bg-white border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          {disease.disease_name}
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {disease.disease_tags?.map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <div className="p-4 bg-zinc-50 rounded-md border-l-4 border-zinc-900 dark:bg-zinc-950 dark:border-zinc-100">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">01. Clinical Signatures</h3>
          <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            <TextParser text={disease.dim1_clinical_signatures} />
          </p>
        </div>

        <Accordion className="w-full">
          <AccordionItem value="dim2" className="border-zinc-200 dark:border-zinc-800">
            <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:no-underline font-medium text-xs">
              02. Targeted Hx & High-Yield PE
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 pt-2">
                <TextParser text={disease.dim2_targeted_hx_pe} />
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dim3" className="border-zinc-200 dark:border-zinc-800">
            <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:no-underline font-medium text-xs">
              03. Make-or-Break Investigations
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 pt-2">
                <TextParser text={disease.dim3_investigations} />
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dim4" className="border-zinc-200 dark:border-zinc-800">
            <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:no-underline font-medium text-xs">
              04. Stepwise Management Plan
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 pt-2">
                <TextParser text={disease.dim4_management} />
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dim5" className="border-zinc-200 dark:border-zinc-800">
            <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:no-underline font-medium text-xs">
              05. Patient Education & Advice
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 pt-2">
                <TextParser text={disease.dim5_education} />
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}