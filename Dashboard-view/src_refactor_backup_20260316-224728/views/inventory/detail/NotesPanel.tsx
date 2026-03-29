import React from 'react';

export function DetailNotesPanel({
  notes,
  noteInput,
  onNoteInputChange,
  onAddNote,
}: {
  notes: string[];
  noteInput: string;
  onNoteInputChange: (value: string) => void;
  onAddNote: () => void;
}) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold">Notes & Actions</h4>
        <button onClick={onAddNote} className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white" type="button">
          Add Note
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={noteInput}
          onChange={(e) => onNoteInputChange(e.target.value)}
          placeholder="Add a note about this card..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm"
        />
      </div>
      <div className="mt-4 space-y-3">
        {notes.map((note) => (
          <div key={note} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-sm">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}

