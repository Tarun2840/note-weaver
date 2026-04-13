import { Note } from '@/hooks/useNotes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, CheckCircle, FileText } from 'lucide-react';

interface MarkdownEditorProps {
  note: Note | null;
  saving: boolean;
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

export function MarkdownEditor({ note, saving, onUpdate }: MarkdownEditorProps) {
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No note selected</p>
          <p className="text-sm mt-1">Create or select a note to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <input
          value={note.title}
          onChange={e => onUpdate(note.id, { title: e.target.value })}
          placeholder="Note title..."
          className="flex-1 text-lg font-semibold bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          {saving ? (
            <>
              <Save className="h-3.5 w-3.5 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Split editor/preview */}
      <div className="flex-1 flex min-h-0">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0">
          <div className="px-6 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/30">
            Markdown
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <textarea
              value={note.content}
              onChange={e => onUpdate(note.id, { content: e.target.value })}
              placeholder="Start writing in Markdown...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

`inline code`

```
code block
```

[Link text](url)"
              className="editor-textarea"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/30">
            Preview
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {note.content ? (
              <div className="markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground/40 italic">
                Start typing to see the preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
