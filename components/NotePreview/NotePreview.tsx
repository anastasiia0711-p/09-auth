'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';
import css from './NotePreview.module.css';

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
}

interface NotePreviewProps {
  notes: Note[];
}

export function NotePreview({ notes }: NotePreviewProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (!notes || notes.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No notes found.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {notes.map((note) => (
        <div key={note.id} className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              {note.tag && <span className={css.tag}>{note.tag}</span>}
            </div>

            <p className={css.content}>{note.content}</p>

            <div className={css.date}>
              {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Link href={`/notes/${note.id}`} className={css.backBtn}>
                View Details
              </Link>
              
              <button
                onClick={() => deleteMutation.mutate(note.id)}
                style={{
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}