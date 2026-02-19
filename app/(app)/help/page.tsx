export default function HelpPage() {
  return (
    <div className="p-6 max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Help & Guide</h1>
      {[
        { title: 'Getting Started', content: 'Create a project from the Dashboard. Each project has five tabs: Coordination, Assembly, Prompts, Performance, and Settings.' },
        { title: 'Coordination Table', content: 'Add tasks, assign them to AI models, set priority, and track status. Update status inline by clicking the dropdown next to each task.' },
        { title: 'Assembly Editor', content: 'Create sections and write or paste content into each one. The editor auto-saves as you type. Use the toolbar for formatting.' },
        { title: 'Prompt Library', content: 'Store prompts for each AI and task. Click Copy to copy a prompt to your clipboard instantly. Filter by AI using the buttons at the top.' },
        { title: 'Performance Tracker', content: 'Log ratings, revision counts, and time for each task. Export to CSV for analysis. View per-AI averages at the top of the page.' },
        { title: 'Framework Library', content: 'Browse and edit all 16 framework documents. Documents are seeded automatically on your first visit. All docs are fully editable.' },
        { title: 'Share Links', content: 'Generate share links from Project Settings. Share the URL with AIs or collaborators to give them read access to your project context.' },
        { title: 'Export & Backup', content: 'Export your full project as JSON from Project Settings. This includes all tasks, sections, prompts, and performance records.' },
        { title: 'Testing Lab', content: 'Use the Testing Lab to preview HTML from AI outputs, render Markdown, or validate JSON before using it in your project.' },
        { title: 'Keyboard Shortcuts', content: 'Tab navigation: click tabs to switch. Escape closes dialogs. Enter in a text field submits forms.' },
      ].map(section => (
        <div key={section.title} className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">{section.title}</h2>
          <p className="text-sm text-muted-foreground">{section.content}</p>
        </div>
      ))}
    </div>
  )
}
