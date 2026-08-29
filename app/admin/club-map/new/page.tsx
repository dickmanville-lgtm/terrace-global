import { addClub } from './actions';
import Link from 'next/link';

export default function NewClubPage() {
  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '2rem' }}>
      <Link href="/admin/club-map" style={{ color: '#666', fontSize: '0.9rem' }}>
        ← Back to club list
      </Link>
      <h1>Add a new club</h1>

      <form action={addClub} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <label>
          Ground name
          <input name="name" required style={{ width: '100%', display: 'block' }} placeholder="e.g. Emirates Stadium" />
        </label>

        <label>
          Club name
          <input name="club" required style={{ width: '100%', display: 'block' }} placeholder="e.g. Arsenal" />
        </label>

        <label>
          Slug (URL-friendly, e.g. arsenal)
          <input name="slug" required style={{ width: '100%', display: 'block' }} placeholder="e.g. arsenal" />
        </label>

        <label>
          Country
          <input name="country" required style={{ width: '100%', display: 'block' }} placeholder="e.g. England" />
        </label>

        <label>
          Website
          <input name="website" style={{ width: '100%', display: 'block' }} placeholder="https://..." />
        </label>

        <label>
          Latitude
          <input name="latitude" type="number" step="any" style={{ width: '100%', display: 'block' }} />
        </label>

        <label>
          Longitude
          <input name="longitude" type="number" step="any" style={{ width: '100%', display: 'block' }} />
        </label>

        <button type="submit" style={{ alignSelf: 'flex-start' }}>Add club</button>
      </form>
    </div>
  );
}