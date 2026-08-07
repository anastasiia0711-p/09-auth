'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useNoteStore } from '@/lib/store/noteStore';
import { NoteForm } from '@/components/NoteForm/NoteForm';
import toast from 'react-hot-toast';
import css from './CreateNoteClient.module.css';

type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting';

export default function CreateNoteClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      toast.success('Note created successfully!');
      router.push('/notes/filter/all');
    },
    onError: () => {
      toast.error('Failed to create note.');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as NoteTag;

    mutation.mutate({ title, content, tag });
  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm formAction={handleSubmit} isPending={mutation.isPending} />
      </div>
    </main>
  );
}