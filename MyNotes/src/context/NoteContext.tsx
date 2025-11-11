import React, { createContext, useContext, useEffect, useReducer, type Dispatch } from 'react';
import type { Note } from '../types/Note';
import { useNoteStorage } from '../hooks/useNoteStorage';

type State = {
	notes: Note[];
	isInitialized: boolean;
};

type Action =
	| { type: 'SET_NOTES'; payload: Note[] }
	| { type: 'ADD_NOTE'; payload: Note }
	| { type: 'UPDATE_NOTE'; payload: Note }
	| { type: 'DELETE_NOTE'; payload: string };

const initialState: State = {
	notes: [],
	isInitialized: false,
};

function noteReducer(state: State, action: Action): State {
	switch (action.type) {
		case 'SET_NOTES':
			return { ...state, notes: action.payload, isInitialized: true };
		case 'ADD_NOTE':
			return { ...state, notes: [action.payload, ...state.notes] };
		case 'UPDATE_NOTE':
			return {
				...state,
				notes: state.notes.map((n) => (n.id === action.payload.id ? action.payload : n)),
			};
		case 'DELETE_NOTE':
			return {
				...state,
				notes: state.notes.filter((n) => n.id !== action.payload),
			};
		default:
			return state;
	}
}

type NoteContextValue = {
	state: State;
	dispatch: Dispatch<Action>;
};

const NoteContext = createContext<NoteContextValue | undefined>(undefined);

export const NoteProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(noteReducer, initialState);
	const { loadNotesFromStorage, saveNotesToStorage } = useNoteStorage();

	useEffect(() => {
		(async () => {
			const notes = await loadNotesFromStorage();
			dispatch({ type: 'SET_NOTES', payload: notes });
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!state.isInitialized) return;
		(async () => {
			await saveNotesToStorage(state.notes);
		})();
	}, [state.notes, state.isInitialized, saveNotesToStorage]);

	return <NoteContext.Provider value={{ state, dispatch }}>{children}</NoteContext.Provider>;
};

export function useNotes(): NoteContextValue {
	const ctx = useContext(NoteContext);
	if (!ctx) throw new Error('useNotes must be used within a NoteProvider');
	return ctx;
}


