import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedNote = notes.find(n => n.id === selectedId) || null;

  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setNotes(data);
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
      }
    }
    setLoading(false);
  }, [selectedId]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = useCallback(async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ title: 'Untitled Note', content: '' })
      .select()
      .single();

    if (!error && data) {
      setNotes(prev => [data, ...prev]);
      setSelectedId(data.id);
    }
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaving(true);

    saveTimerRef.current = setTimeout(async () => {
      await supabase.from('notes').update(updates).eq('id', id);
      setSaving(false);
    }, 800);
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await supabase.from('notes').delete().eq('id', id);
    setNotes(prev => {
      const remaining = prev.filter(n => n.id !== id);
      if (selectedId === id) {
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  }, [selectedId]);

  const filteredNotes = searchQuery
    ? notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  return {
    notes: filteredNotes,
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
  };
}
