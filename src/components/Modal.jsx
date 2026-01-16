import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        {title && <h3>{title}</h3>}
        <div style={{ marginTop: 10 }}>{children}</div>
      </div>
    </div>
  );
}