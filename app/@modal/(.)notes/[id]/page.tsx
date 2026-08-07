import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import ModalClient from './Modal.client'; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreviewPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModalClient noteId={id} />
    </HydrationBoundary>
  );
}


