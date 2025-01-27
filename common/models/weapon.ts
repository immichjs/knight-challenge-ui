import type { EAttribute } from '../enums/attribute.enum';

export interface Weapon {
	name: string;
	mod: number;
	attr: EAttribute;
	equipped: boolean;
}
