'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';

interface ModalClientProps {
  noteId: string;
}

export default function ModalClient({ noteId }: ModalClientProps) {
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
    <div style={backdropStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={handleClose}>
          &times;
        </button>

        {isLoading && <p>Loading note details...</p>}
        {isError && <p>Failed to load note.</p>}

        {note && (
          <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            {note.tag && <span style={tagStyle}>{note.tag}</span>}
          </div>
        )}
      </div>
    </div>
  );
}


const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
};

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '12px',
  padding: '4px 8px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  fontSize: '12px',
};