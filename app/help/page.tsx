export default function HelpPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Help & Guide</h1>
      <div className="prose space-y-4 text-sm">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <p className="text-muted-foreground">Framework Command Center is your coordination hub for multi-AI projects. Here&apos;s how to use each feature:</p>
        <h3 className="font-medium">Dashboard</h3>
        <p className="text-muted-foreground">Create and manage your projects. Click &ldquo;New Project&rdquo; to start, then &ldquo;Open Project&rdquo; to begin working.</p>
        <h3 className="font-medium">Coordination Table</h3>
        <p className="text-muted-foreground">Add tasks, assign them to AI models, and track their status. Use the inline dropdowns to update status and priority.</p>
        <h3 className="font-medium">Assembly Editor</h3>
        <p className="text-muted-foreground">Create sections and paste AI outputs into them. Content auto-saves as you type.</p>
        <h3 className="font-medium">Prompt Library</h3>
        <p className="text-muted-foreground">Store your prompts here. Use the copy button to quickly grab a prompt before sending it to an AI.</p>
        <h3 className="font-medium">Performance Tracker</h3>
        <p className="text-muted-foreground">Rate AI outputs 1-5 stars and track revisions. Export as CSV for analysis.</p>
        <h3 className="font-medium">Framework Library</h3>
        <p className="text-muted-foreground">16 pre-loaded framework documents. Click any document to read or edit it.</p>
        <h3 className="font-medium">Testing Lab</h3>
        <p className="text-muted-foreground">Preview HTML output, render Markdown, or validate JSON from AI responses.</p>
      </div>
    </div>
  )
}
