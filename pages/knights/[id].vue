<script setup lang="ts">
import moment from 'moment';
import { EAttribute } from '~/common/enums/attribute.enum';
import type { Attribute } from '~/common/models/attribute';
import type { Knight } from '~/common/models/knight';
import { updateKnightSchema } from '~/common/schemas/update-knight.schema';

definePageMeta({
	layout: 'base',
});

const route = useRoute();
const { $api } = useNuxtApp();

const { defineField, values, setFieldValue, validate, errors, meta } = useForm({
	validationSchema: updateKnightSchema,
	initialValues: {
		nickname: '',
	},
});

const [nickname] = defineField('nickname');

const id = computed(() => route.params['id'].toString());

const knight = ref<Knight>();

onMounted(() => {
	onLoadKnight();
});

const onLoadKnight = async () => {
	const resource = `/knights/${id.value}`;
	await $api
		.get<Knight>(resource)
		.then((response) => {
			knight.value = response.data;
			nickname.value = knight.value.nickname;
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};

const onMakeHimAHero = async () => {
	const confirm = window.confirm(
		'Deseja realmente tornar esse cavaleiro um Herói?',
	);

	if (!confirm) return;

	const resource = `/knights/${id.value}`;
	await $api
		.delete<Knight>(resource)
		.then((response) => {
			if (response.status === 204) {
				onLoadKnight();
			}
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};

const knightAttributesList = (attributes: Attribute) => {
	return Object.values(EAttribute).map((key) => ({
		label: key,
		value: attributes[key],
	}));
};

const weaponEquipped = (equipped: boolean) =>
	equipped ? 'Equipado' : 'Nâo equipado';

const onUpdateKnight = async () => {
	const resource = `/knights/${id.value}`;
	await $api
		.patch<Knight>(resource, values)
		.then((response) => {
			if (response.status === 200) {
				alert('Apelido atualizado.');
			}
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};
</script>

<template>
	<main class="md:min-h-[calc(100vh-4rem)] flex justify-center bg-zinc-50 p-8">
		<section
			class="w-full md:w-auto flex flex-col md:flex-row justify-between md bg-white border border-zinc-200"
			v-if="knight"
		>
			<section
				class="md:min-w-[32rem] border-b md:border-r md:border-b-0 border-zinc-200"
			>
				<h2
					class="flex justify-between items-center gap-2 w-full border-b px-4 h-12 border-zinc-200 font-medium text-zinc-800"
				>
					<div class="flex items-center gap-2">
						<Icon name="solar:user-broken" size="20" class="text-amber-600" />
						Dados básicos
						<template v-if="knight.deletedAt">
							(<span class="flex items-center gap-2 text-xs text-amber-600">
								Se tornou um Herói </span
							>)
						</template>
					</div>

					<button
						class="bg-emerald-600 text-white rounded-sm px-4 py-2 text-xs cursor-pointer"
						v-if="!knight.deletedAt"
						@click="onMakeHimAHero()"
					>
						Torná-lo Herói
					</button>
				</h2>

				<div
					class="flex flex-col justify-between p-4 text-lg h-[calc(100%-3rem)]"
					v-if="knight"
				>
					<div class="flex flex-col gap-3">
						<div class="flex flex-col">
							<label class="text-sm">Nome:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm disabled:cursor-not-allowed"
								disabled
								type="text"
								:value="knight.name"
							/>
						</div>

						<form class="flex flex-col" @submit.prevent="onUpdateKnight()">
							<label class="text-sm">Apelido:</label>
							<div class="w-full flex gap-1">
								<input
									class="w-full border py-2 px-3 rounded-sm border-zinc-200 text-sm disabled:cursor-not-allowed"
									:disabled="!!knight.deletedAt"
									type="text"
									v-model="nickname"
								/>
								<button
									type="submit"
									class="bg-emerald-600 text-white rounded-md text-xs px-4 h-10 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed"
									:disabled="!meta.valid"
									v-if="!knight.deletedAt"
								>
									Alterar
								</button>
							</div>
						</form>

						<div class="flex flex-col">
							<label class="text-sm">Nascido em:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm disabled:cursor-not-allowed"
								disabled
								type="text"
								:value="moment(knight.birthday).format('lll')"
							/>
						</div>

						<div class="flex flex-col">
							<label class="text-sm">Atributo Chave:</label>
							<input
								class="border py-2 px-3 rounded-sm border-zinc-200 text-sm disabled:cursor-not-allowed"
								disabled
								type="text"
								:value="knight.keyAttribute"
							/>
						</div>
					</div>

					<div>
						<p class="flex items-center text-sm gap-2">
							<Icon name="fluent-emoji:crossed-swords" size="24" />
							+{{ knight.attack }} de Ataque
						</p>
						<p class="flex items-center text-sm gap-2">
							<Icon name="fluent-emoji-flat:glowing-star" size="24" />
							{{ knight.exp }}xp
						</p>
					</div>
				</div>
			</section>
			<section class="w-full md:min-w-80">
				<section>
					<h2
						class="flex items-center gap-2 w-full border-b px-4 h-12 border-zinc-200 font-medium text-zinc-800"
					>
						<Icon
							name="game-icons:zeus-sword"
							size="20"
							class="text-amber-600"
						/>
						Armas
					</h2>

					<ul class="h-80 overflow-y-auto">
						<template v-if="knight.weapons.length">
							<li
								class="flex items-center border-b first:border-b border-zinc-200 bg-zinc-50 px-4 py-2 gap-3"
								v-for="weapon of knight.weapons"
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
											{{ weapon.name }}
										</p>

										<span
											class="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded"
											>{{ weaponEquipped(weapon.equipped) }}</span
										>
									</div>

									<div class="flex flex-col gap-1">
										<p class="text-xs text-amber-500">
											+{{ weapon.mod }} {{ weapon.attr }}
										</p>
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
							class="px-4 py-1"
							v-for="attribute in knightAttributesList(knight.attributes)"
						>
							<div>
								<p class="text-zinc-800 font-medium text-sm capitalize mb-1">
									{{ attribute.label }}: (
									<span class="text-emerald-600">{{ attribute.value }}</span
									>/10 )
								</p>
								<RatingBar :value="attribute.value" />
							</div>
						</li>
					</ul>
				</section>
			</section>
		</section>
	</main>
</template>
