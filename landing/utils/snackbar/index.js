import evaluateErrorReturn from '@/utils/errors/evaluateErrorReturn';

export const generateSnackBarError = e => ({
	content: evaluateErrorReturn(e),
	color: 'error',
});

export const snackBarError = e => commit => {
	commit('Snackbar/showMessage', generateSnackBarError(e), { root: true });
};

export const snackBarSuccess = message => commit => {
	commit(
		'Snackbar/showMessage',
		{
			content: message,
			color: 'success',
		},
		{ root: true }
	);
};
