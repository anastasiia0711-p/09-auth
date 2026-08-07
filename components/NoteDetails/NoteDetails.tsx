import React from 'react';

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  return (
    <div>
      <h2>Деталі нотатки № {id}</h2>
      {}
    </div>
  );
}