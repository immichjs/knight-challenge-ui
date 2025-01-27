import * as yup from 'yup';
import { EAttribute } from '../enums/attribute.enum';

export const createWeaponSchema = yup.object({
	name: yup.string().max(32).required(),
	mod: yup.number().min(1).max(10).required(),
	attr: yup.string().oneOf(Object.values(EAttribute)),
	equipped: yup.boolean().required(),
});
