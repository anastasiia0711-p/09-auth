import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

interface Props {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const tag = slug && slug.length > 0 ? slug[0] : 'all';
  const titleTag = tag === 'all' ? 'All Notes' : `Notes: ${tag}`;

  return {
    title: `${titleTag} | NoteHub`,
    description: `Browse your notes filtered by ${tag} in NoteHub.`,
    openGraph: {
      title: `${titleTag} | NoteHub`,
      description: `Browse your notes filtered by ${tag} in NoteHub.`,
      url: `https://notehub.com/notes/filter/${slug ? slug.join('/') : ''}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - Filter ${tag}`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params, searchParams }: Props) {
  const slug = params.slug;
  const tag = slug && slug.length > 0 ? slug[0] : 'all';
  const currentTag = tag === 'all' ? '' : tag;

  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

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