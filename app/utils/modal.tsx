import { render, h } from 'vue';
import ConfirmDialog from '~/components/confirm.vue';

export async function showModal(vnode: VNode) {
	const container = document.createElement('div');
	render(vnode, container);
	const dialog = container.firstElementChild;
	if (!(dialog instanceof HTMLDialogElement)) {
		render(null, container);
		return null;
	}

	const { promise, resolve } = Promise.withResolvers();

	document.body.append(dialog);

	dialog.addEventListener('close', () => resolve(dialog.returnValue));
	dialog.showModal();

	const result = await promise;

	Promise.allSettled(dialog.getAnimations().map(anim => anim.finished)).then(() => {
		dialog.remove();
		render(null, container);
	});
	return result;
}

export async function confirm(message: string) {
	const result = await showModal(<ConfirmDialog message={message} />);
	return result === 'OK';
}