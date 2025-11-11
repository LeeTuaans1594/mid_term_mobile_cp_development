import React from 'react';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonText,
	IonButtons,
	IonButton,
	IonIcon,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCardContent,
	IonFab,
	IonFabButton,
	IonItem,
	IonLabel,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
} from '@ionic/react';
import { add, documentTextOutline, trash } from 'ionicons/icons';
import { useNotes } from '../context/NoteContext';
import { useHistory } from 'react-router-dom';

const HomePage: React.FC = () => {
	const { state, dispatch } = useNotes();
	const history = useHistory();
	const [presentAlert] = useIonAlert();
	const isEmpty = state.isInitialized && state.notes.length === 0;

	const presentDeleteConfirm = (noteId: string) => {
		presentAlert({
			header: 'Xác nhận Xóa',
			message: 'Bạn có chắc chắn muốn xóa ghi chú này?',
			buttons: [
				{ text: 'Hủy', role: 'cancel' },
				{
					text: 'Đồng ý',
					role: 'confirm',
					handler: () => dispatch({ type: 'DELETE_NOTE', payload: noteId }),
				},
			],
		});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>My Notes</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{isEmpty ? (
					<div
						style={{
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '16px',
							textAlign: 'center',
							flexDirection: 'column',
							gap: '8px',
						}}
					>
						<IonIcon icon={documentTextOutline} style={{ fontSize: 48, color: 'var(--ion-color-medium)' }} />
						<IonText color="medium">
							<p>Chưa có ghi chú nào. Nhấn nút + để thêm ghi chú mới.</p>
						</IonText>
					</div>
				) : (
					<div className="ion-padding">
						{state.notes.map((note) => (
							<IonItemSliding key={note.id}>
								<IonItem button detail={false} onClick={() => history.push(`/edit/${note.id}`)}>
									<IonLabel>
										<IonText color="medium">
											<small>
												{note.createdAt.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
											</small>
										</IonText>
										<h2 style={{ whiteSpace: 'pre-wrap' }}>
											{note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}
										</h2>
									</IonLabel>
								</IonItem>
								<IonItemOptions side="end">
									<IonItemOption
										color="danger"
										onClick={(e) => {
											(e.currentTarget as HTMLElement).closest('ion-item-sliding')?.close();
											presentDeleteConfirm(note.id);
										}}
									>
										<IonIcon icon={trash} slot="start" />
										Xóa
									</IonItemOption>
								</IonItemOptions>
							</IonItemSliding>
						))}
					</div>
				)}

				{/* FAB thêm ghi chú ở góc dưới bên phải */}
				<IonFab slot="fixed" vertical="bottom" horizontal="end">
					<IonFabButton routerLink="/add" aria-label="Thêm ghi chú">
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default HomePage;


