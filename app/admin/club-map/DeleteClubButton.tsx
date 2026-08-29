'use client';

import { deleteClub } from './actions';

export default function DeleteClubButton({ groundId, clubName }: { groundId: number; clubName: string }) {
  return (
    <form
      action={deleteClub}
      onSubmit={(e) => {
        if (!confirm(`Delete ${clubName}? This removes the club and all its page content permanently.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="groundId" value={groundId} />
      <button type="submit" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
        Delete
      </button>
    </form>
  );
}