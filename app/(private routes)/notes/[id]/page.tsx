import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetails from '@/components/NoteDetails/NoteDetails';

interface NotePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = params;
  
  let noteTitle = 'Note Details';
  let noteDescription = 'View your note details in NoteHub.';

  try {
    const note = await fetchNoteById(id);
    if (note) {
      noteTitle = note.title;
      noteDescription = note.content ? note.content.slice(0, 100) + '...' : noteDescription;
    }
  }  catch {
    
  }

  return {
    title: `${noteTitle} | NoteHub`,
    description: noteDescription,
    openGraph: {
      title: `${noteTitle} | NoteHub`,
      description: noteDescription,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: noteTitle,
        },
      ],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main style={{ padding: '2rem' }}>
        <h1>Деталі нотатки</h1>
        <NoteDetails id={id} />
      </main>
    </HydrationBoundary>
  );
}







