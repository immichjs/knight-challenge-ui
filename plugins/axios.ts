import axios from 'axios';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const axiosInstance = axios.create({
		baseURL: config.public.baseURL,
	});

	return {
		provide: {
			api: axiosInstance,
		},
	};
});
