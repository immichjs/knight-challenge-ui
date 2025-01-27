interface ModalState {
	createWeapon?: boolean;
	updateNickname?: boolean;
}

export type ModalType = keyof ModalState;

export const useModalStore = defineStore('modal', {
	state: (): ModalState => ({}),
	actions: {
		open(modal: ModalType) {
			this.$reset();
			this[modal] = true;
		},
		close(modal: ModalType) {
			this[modal] = false;
		},
		toggle(modal: ModalType) {
			this.$reset();
			this[modal] = !this[modal];
		},
	},
});
