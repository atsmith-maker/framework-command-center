'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TestingLab() {
  const [htmlInput, setHtmlInput] = useState('')
  const [mdInput, setMdInput] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [jsonResult, setJsonResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const validateJson = () => {
    try { JSON.parse(jsonInput); setJsonResult({ ok: true, msg: '✓ Valid JSON' }) }
    catch (e: unknown) { setJsonResult({ ok: false, msg: `✗ ${e instanceof Error ? e.message : 'Invalid JSON'}` }) }
  }

  const mdToHtml = (md: string) => md
    .replace(/^### (.+)/gm, '<h3>$1</h3>').replace(/^## (.+)/gm, '<h2>$1</h2>').replace(/^# (.+)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>').replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>').replace(/^(?!<[h|l])/gm, '').trim()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Testing Lab</h1>
      <Tabs defaultValue="html">
        <TabsList>
          <TabsTrigger value="html">HTML Preview</TabsTrigger>
          <TabsTrigger value="markdown">Markdown Render</TabsTrigger>
          <TabsTrigger value="json">JSON Validator</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="space-y-3">
          <Textarea value={htmlInput} onChange={e => setHtmlInput(e.target.value)} rows={10} placeholder="Paste HTML here..." className="font-mono text-sm" />
          <div className="rounded-md border p-4 bg-white min-h-[200px]" dangerouslySetInnerHTML={{ __html: htmlInput }} />
        </TabsContent>
        <TabsContent value="markdown" className="space-y-3">
          <Textarea value={mdInput} onChange={e => setMdInput(e.target.value)} rows={10} placeholder="Paste Markdown here..." className="font-mono text-sm" />
          <div className="rounded-md border p-4 prose max-w-none min-h-[200px]" dangerouslySetInnerHTML={{ __html: mdToHtml(mdInput) }} />
        </TabsContent>
        <TabsContent value="json" className="space-y-3">
          <Textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} rows={10} placeholder="Paste JSON here..." className="font-mono text-sm" />
          <div className="flex items-center gap-3">
            <Button onClick={validateJson}>Validate</Button>
            {jsonResult && <span className={jsonResult.ok ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>{jsonResult.msg}</span>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
