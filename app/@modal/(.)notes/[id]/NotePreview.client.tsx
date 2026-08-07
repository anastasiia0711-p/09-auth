'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { Modal } from '../../../../components/Modal/Modal'; 

interface NotePreviewClientProps {
  noteId: string;
}

export default function NotePreviewClient({ noteId }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading note details...</p>}
      {isError && <p>Failed to load note details.</p>}

      {note && (
        <div style={{ padding: '16px' }}>
          <h2>{note.title}</h2>
          <p style={{ marginTop: '12px', whiteSpace: 'pre-wrap' }}>{note.content}</p>
          {note.tag && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '4px 8px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {note.tag}
            </span>
          )}
        </div>
      )}
    </Modal>
  );
}