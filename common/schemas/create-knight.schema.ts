import * as yup from 'yup';
import { EAttribute } from '../enums/attribute.enum';

export const createKnightSchema = yup.object({
	name: yup.string().required().max(64),
	nickname: yup.string().required().max(32),
	birthday: yup.date().max(new Date()).required(),
	weapons: yup
		.array()
		.of(
			yup.object().shape({
				name: yup.string().max(32).required(),
				mod: yup.number().min(0).max(10).required(),
				attr: yup.string().oneOf(Object.values(EAttribute)),
				equipped: yup.boolean().required(),
			}),
		)
		.min(1),
	attributes: yup.object({
		strength: yup.number().min(0).max(10).required(),
		dexterity: yup.number().min(0).max(10).required(),
		constitution: yup.number().min(0).max(10).required(),
		intelligence: yup.number().min(0).max(10).required(),
		wisdom: yup.number().min(0).max(10).required(),
	}),
	keyAttribute: yup.string().oneOf(Object.values(EAttribute)),
});
