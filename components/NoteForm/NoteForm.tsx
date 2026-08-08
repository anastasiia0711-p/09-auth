'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note'; 
import toast from 'react-hot-toast';
import css from './NoteForm.module.css';

export const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const titleId = useId();
  const contentId = useId();
  const tagId = useId();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      toast.success('Note created successfully!');
      router.push('/notes/filter');
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
      toast.error('Failed to create note. Please try again.');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({
      ...draft,
      [name]: value,
    });
  };

  
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    mutate({
      title: draft.title,
      content: draft.content,
      tag: (draft.tag || 'Todo') as NoteTag, 
    });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.fieldGroup}>
        <label htmlFor={titleId} className={css.label}>Title</label>
        <input
          id={titleId}
          name="title"
          type="text"
          required
          maxLength={50}
          value={draft.title}
          onChange={handleChange}
          className={css.input}
        />
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor={contentId} className={css.label}>Content</label>
        <textarea
          id={contentId}
          name="content"
          required
          rows={5}
          maxLength={500}
          value={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>

      <div className={css.fieldGroup}>
        <label htmlFor={tagId} className={css.label}>Tag</label>
        <select
          id={tagId}
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          disabled={isPending}
          className={css.submitButton}
        >
          {isPending ? 'Creating...' : 'Create note'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className={css.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};