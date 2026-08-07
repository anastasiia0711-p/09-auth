import type { Metadata } from 'next';
import CreateNoteClient from '@/components/CreateNoteClient/CreateNoteClient';

export const metadata: Metadata = {
  title: 'Create note',
  description: 'Create a new personal note to organize your tasks, work, and ideas efficiently.',
  openGraph: {
    title: 'Create note',
    description: 'Create a new personal note to organize your tasks, work, and ideas efficiently.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create note',
      },
    ],
  },
};

export default function CreateNotePage() {
  return <CreateNoteClient />;
}