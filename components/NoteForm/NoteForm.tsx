'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

interface NoteFormProps {
  formAction: (formData: FormData) => void | Promise<void>;
  isPending?: boolean;
}

export const NoteForm = ({ formAction, isPending = false }: NoteFormProps) => {
  const router = useRouter();
  const titleId = useId();
  const contentId = useId();
  const tagId = useId();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({
      ...draft,
      [name]: value,
    });
  };

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
    clearDraft();
  };

  return (
    <form action={handleSubmit} className={css.form}>
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