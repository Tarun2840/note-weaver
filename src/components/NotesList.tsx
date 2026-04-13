import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function NotesList({
  notes,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onCreate,
  onDelete,
}: NotesListProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPreview = (content: string) => {
    const plain = content.replace(/[#*`\[\]()_~>-]/g, '').trim();
    return plain.slice(0, 60) || 'No content';
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-foreground">Notes</h1>
          <Button size="sm" onClick={onCreate} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            {searchQuery ? 'No matching notes' : 'No notes yet. Create one!'}
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              onClick={() => onSelect(note.id)}
              className={`group px-4 py-3 cursor-pointer border-b border-border transition-colors ${
                note.id === selectedId
                  ? 'bg-[hsl(var(--note-active))]'
                  : 'hover:bg-[hsl(var(--note-hover))]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {note.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {getPreview(note.content)}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDate(note.updated_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(note.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
