import type { EAttribute } from '../enums/attribute.enum';
import type { Attribute } from './attribute';
import type { Weapon } from './weapon';

export interface Knight {
	_id: string;
	name: string;
	nickname: string;
	age: number;
	attack: number;
	exp: number;
	birthday: Date | string;
	weapons: Weapon[];
	attributes: Attribute;
	keyAttribute: EAttribute;
	isDeleted: boolean;
	deletedAt: Date | string;
}
