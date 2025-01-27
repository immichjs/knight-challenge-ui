import * as yup from 'yup';

export const updateKnightSchema = yup.object({
	nickname: yup.string().max(32).required(),
});
