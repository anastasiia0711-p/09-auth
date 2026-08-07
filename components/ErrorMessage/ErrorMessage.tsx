import React from 'react';
import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p className={css.error}>{message}</p>;
};