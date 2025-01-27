<script setup lang="ts">
import { useForm } from 'vee-validate';
import { EAttribute } from '~/common/enums/attribute.enum';
import type { Knight } from '~/common/models/knight';
import type { Weapon } from '~/common/models/weapon';

import { createKnightSchema } from '~/common/schemas/create-knight.schema';

definePageMeta({
	layout: 'base',
});

const { $api } = useNuxtApp();
const modalStore = useModalStore();

const { defineField, values, setFieldValue, validate, errors, meta } = useForm({
	validationSchema: createKnightSchema,
	initialValues: {
		name: '',
		nickname: '',
		birthday: '',
		keyAttribute: EAttribute.STRENGTH,
		attributes: {
			strength: 0,
			dexterity: 0,
			constitution: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0,
		},
		weapons: [] as Weapon[],
	},
});

const attributesList: Array<{ key: EAttribute }> = Object.values(
	EAttribute,
).map((attribute) => ({ key: attribute }));

const [name] = defineField('name');
const [nickname] = defineField('nickname');
const [birthday] = defineField('birthday');
const [keyAttribute] = defineField('keyAttribute');
const [weapons] = defineField('weapons');

const addWeapon = (weapon: Weapon) => {
	weapons.value.push(weapon);
};

const updateAttribute = (attr: EAttribute, delta: number) => {
	const newValue = Math.max(0, Math.min(10, values.attributes[attr] + delta));
	setFieldValue(`attributes.${attr}`, newValue);
};

const onSubmit = async () => {
	const result = await validate();

	if (!result.valid) {
		console.log('Erro na validação', errors.value);
		return;
	}

	await $api
		.post<Knight>('/knights', values)
		.then((response) => {
			if (response.status === 201) {
				navigateTo('/');
			}
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};

const removeWeapon = (weapon: Weapon) => {
	const weaponIndex = values.weapons.findIndex(
		(w) => JSON.stringify(w) === JSON.stringify(weapon),
	);

	if (weaponIndex >= 0) {
		weapons.value.splice(weaponIndex, 1);
	}
};

watchEffect(() => {
	if (birthday.value && new Date(birthday.value) > new Date()) {
		alert('A data de nascimento não pode ser no futuro.');
		birthday.value = '';
	}
});
</script>

<template>
	<main
		class="md:min-h-[calc(100vh-4rem)] flex flex-col md:flex-row md:justify-center items-center gap-4 bg-zinc-50 p-8"
	>
		<WeaponModal
			@new-weapon="addWeapon($event)"
			v-if="modalStore.createWeapon"
		/>

		<section
			class="w-full md:w-auto flex flex-col md:flex-row justify-between bg-white border border-zinc-200"
		>
			<section
				class="w-full md:min-w-[32rem] border-b md:border-r md:border-b-0 border-zinc-200"
			>
				<h2
					class="flex justify-between items-center gap-2 w-full border-b px-4 h-12 border-zinc-200 font-medium text-zinc-800"
				>
					<div class="flex items-center gap-2">
						<Icon name="solar:user-broken" size="20" class="text-amber-600" />
						Dados básicos
					</div>
				</h2>

				<div
					class="flex flex-col justify-between p-4 text-lg h-[calc(100%-3rem)]"
				>
					<div class="flex flex-col gap-3">
						<div class="flex flex-col">
							<label class="text-sm">Nome:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm"
								type="text"
								v-model="name"
								placeholder="Nome"
							/>
						</div>

						<div class="flex flex-col">
							<label class="text-sm">Apelido:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm"
								type="text"
								v-model="nickname"
								placeholder="Apelido"
							/>
						</div>

						<div class="flex flex-col">
							<label class="text-sm">Nascido em:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm"
								type="date"
								v-model="birthday"
							/>
						</div>

						<div class="flex flex-col">
							<label class="text-sm">Atributo Chave:</label>
							<select
								class="border border-zinc-200 py-2 px-3 rounded-sm text-sm"
								v-model="keyAttribute"
							>
								<option
									:value="attribute"
									v-for="attribute in Object.values(EAttribute)"
								>
									{{ attribute }}
								</option>
							</select>
						</div>
					</div>
				</div>
			</section>
			<section class="w-full md:min-w-80">
				<section>
					<h2
						class="flex justify-between items-center gap-2 w-full border-b px-4 h-12 border-zinc-200 font-medium text-zinc-800"
					>
						<div class="flex items-center gap-2">
							<Icon
								name="game-icons:zeus-sword"
								size="20"
								class="text-amber-600"
							/>
							Armas
						</div>

						<button
							class="text-xs px-3 py-2 bg-emerald-600 text-white rounded-sm cursor-pointer"
							@click="modalStore.open('createWeapon')"
						>
							+ Adicionar
						</button>
					</h2>

					<ul class="h-80 overflow-y-auto">
						<template v-if="values.weapons.length">
							<li
								class="flex items-center border-b first:border-b border-zinc-200 bg-zinc-50 px-4 py-2 gap-3"
								v-for="weapon in values.weapons"
							>
								<div
									class="flex justify-center items-center min-w-10 h-10 rounded bg-white border border-zinc-200 text-zinc-400"
								>
									<Icon name="game-icons:zeus-sword" />
								</div>

								<div
									class="flex-1 flex items-center justify-between capitalize"
								>
									<div>
										<p class="truncate max-w-40 text-sm text-zinc-600">
											{{ weapon['name'] }}
										</p>
										<div class="flex items-center gap-1 text-xs">
											<input
												id="equipped-weapon"
												type="checkbox"
												v-model="weapon.equipped"
											/>
											<label for="equipped-weapon">Equipar</label>
										</div>
									</div>

									<div class="flex items-center gap-3">
										<p class="text-xs text-amber-500">
											+{{ weapon['mod'] }} {{ weapon['attr'] }}
										</p>

										<button
											class="flex items-center justify-center border border-zinc-200 p-2 rounded cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 text-red-400"
											@click="removeWeapon(weapon)"
										>
											<Icon name="bitcoin-icons:cross-filled" />
										</button>
									</div>
								</div>
							</li>
						</template>
						<li
							class="border-b border-zinc-200 p-4 text-sm text-zinc-600"
							v-else
						>
							Nenhuma arma foi cadastrada...
						</li>
					</ul>
				</section>

				<section class="flex flex-col">
					<h2
						class="flex items-center gap-2 w-full border-y px-4 h-12 border-zinc-200 font-medium text-zinc-800"
					>
						<Icon
							name="solar:widget-3-outline"
							size="20"
							class="text-amber-600"
						/>
						Atributos
					</h2>

					<ul class="grid grid-rows-6 py-4">
						<li
							v-for="attr in attributesList"
							:key="attr.key"
							class="px-4 py-1"
						>
							<div>
								<p class="text-zinc-800 font-medium text-sm capitalize mb-1">
									{{ attr.key }}: (
									<span class="text-emerald-600">{{
										values.attributes[attr.key]
									}}</span
									>/10 )
								</p>
								<div class="flex items-center gap-2">
									<button
										class="bg-emerald-600 text-white min-w-6 rounded cursor-pointer"
										@click="updateAttribute(attr.key, -1)"
									>
										-
									</button>
									<RatingBar :value="values.attributes[attr.key]" />
									<button
										class="bg-emerald-600 text-white min-w-6 rounded cursor-pointer"
										@click="updateAttribute(attr.key, 1)"
									>
										+
									</button>
								</div>
							</div>
						</li>
					</ul>
				</section>
			</section>
		</section>

		<button
			class="flex items-center bg-amber-600 text-white p-4 rounded cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed"
			type="submit"
			@click="onSubmit()"
			:disabled="!meta.valid"
		>
			<Icon name="ic:round-check" size="32" />
		</button>
	</main>
</template>
