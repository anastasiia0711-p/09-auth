
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from '../../notes/filter/[...slug]/Notes.client'; 

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NotesPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  
  const slug = resolvedParams.slug;
  const tag = slug && slug.length > 0 ? slug[0] : 'all';
  const currentTag = tag === 'all' ? '' : tag;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const page = 1;
  const perPage = 12;

 
  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search, currentTag],
    queryFn: () => fetchNotes({ page, perPage, search, tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}