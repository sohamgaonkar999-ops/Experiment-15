import React from 'react';

// Coloured message box used to show success / error messages
export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={'alert alert-' + type}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}