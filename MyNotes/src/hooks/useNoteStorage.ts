import { Preferences } from '@capacitor/preferences';
import type { Note } from '../types/Note';

const NOTES_KEY = 'MY_NOTES_STORAGE_KEY';

type SerializableNote = Omit<Note, 'createdAt'> & { createdAt: string };

export function useNoteStorage() {
	async function loadNotesFromStorage(): Promise<Note[]> {
		const { value } = await Preferences.get({ key: NOTES_KEY });
		if (!value) return [];
		try {
			const parsed = JSON.parse(value) as SerializableNote[];
			return parsed.map((n) => ({
				...n,
				createdAt: new Date(n.createdAt),
			}));
		} catch {
			return [];
		}
	}

	async function saveNotesToStorage(notes: Note[]): Promise<void> {
		const serializable: SerializableNote[] = notes.map((n) => ({
			...n,
			createdAt: n.createdAt.toISOString(),
		}));
		await Preferences.set({
			key: NOTES_KEY,
			value: JSON.stringify(serializable),
		});
	}

	return { loadNotesFromStorage, saveNotesToStorage };
}


