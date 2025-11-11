import React, { useEffect, useMemo, useState } from 'react';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonTextarea,
	IonButton,
	IonButtons,
	IonBackButton,
	IonItem,
	IonIcon,
	useIonAlert,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import type { Note } from '../types/Note';
import { trash } from 'ionicons/icons';

type RouteParams = {
	id?: string;
};

const NoteDetail: React.FC = () => {
	const { id } = useParams<RouteParams>();
	const isEditMode = useMemo(() => Boolean(id), [id]);
	const history = useHistory();
	const { state, dispatch } = useNotes();
	const [noteContent, setNoteContent] = useState<string>('');
	const [presentAlert] = useIonAlert();

	useEffect(() => {
		if (!isEditMode) {
			setNoteContent('');
			return;
		}
		const note = state.notes.find((n) => n.id === id);
		if (note) setNoteContent(note.content);
	}, [id, isEditMode, state.notes]);

	const handleSave = () => {
		const content = noteContent.trim();
		if (!content) {
			alert('Nội dung ghi chú không được để trống.');
			return;
		}
		if (isEditMode && id) {
			const existing = state.notes.find((n) => n.id === id);
			if (existing) {
				const updated: Note = { ...existing, content };
				dispatch({ type: 'UPDATE_NOTE', payload: updated });
			}
		} else {
			const newNote: Note = {
				id: `${Date.now()}`, // unique enough for app needs
				content,
				createdAt: new Date(),
			};
			dispatch({ type: 'ADD_NOTE', payload: newNote });
		}
		history.goBack();
	};

	const handleDelete = () => {
		if (!isEditMode || !id) return;
		presentAlert({
			header: 'Xác nhận Xóa',
			message: 'Bạn có chắc chắn muốn xóa ghi chú này?',
			buttons: [
				{ text: 'Hủy', role: 'cancel' },
				{
					text: 'Đồng ý',
					role: 'confirm',
					handler: () => {
						dispatch({ type: 'DELETE_NOTE', payload: id });
						history.goBack();
					},
				},
			],
		});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/home" />
					</IonButtons>
					<IonTitle>{isEditMode ? 'Chỉnh sửa Ghi chú' : 'Thêm Ghi chú'}</IonTitle>
					{isEditMode && (
						<IonButtons slot="end">
							<IonButton color="danger" onClick={handleDelete} aria-label="Xóa ghi chú">
								<IonIcon icon={trash} slot="icon-only" />
							</IonButton>
						</IonButtons>
					)}
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen className="ion-padding">
				<IonItem lines="none">
					<IonTextarea
						label="Nội dung ghi chú"
						labelPlacement="floating"
						fill="solid"
						rows={15}
						autoGrow
						value={noteContent}
						onIonInput={(e) => setNoteContent((e as CustomEvent).detail.value ?? '')}
						onIonChange={(e) => setNoteContent(e.detail.value ?? '')}
						placeholder="Nhập nội dung..."
					/>
				</IonItem>
				<div style={{ marginTop: 16 }}>
					<IonButton expand="block" onClick={handleSave}>
						Lưu
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default NoteDetail;


