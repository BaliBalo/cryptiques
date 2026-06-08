export default defineNuxtRouteMiddleware((location) => {
	const { loggedIn } = useUserSession();
	if (!loggedIn.value) {
		return navigateTo({ name: 'connexion', query: { retour: location.fullPath } });
	}
});