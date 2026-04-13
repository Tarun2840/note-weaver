import { NotesList } from '@/components/NotesList';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useNotes } from '@/hooks/useNotes';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    notes,
    selectedNote,
    selectedId,
    loading,
    saving,
    searchQuery,
    setSearchQuery,
    setSelectedId,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 shrink-0">
        <NotesList
          notes={notes}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={setSelectedId}
          onCreate={createNote}
          onDelete={deleteNote}
        />
      </div>

      {/* Editor */}
      <MarkdownEditor
        note={selectedNote}
        saving={saving}
        onUpdate={updateNote}
      />
    </div>
  );
};

export default Index;
