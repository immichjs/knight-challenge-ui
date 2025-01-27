<script setup lang="ts">
import type { Knight } from '~/common/models/knight';

definePageMeta({
	layout: 'base',
});

const { $api } = useNuxtApp();

const knights = ref<Knight[]>([]);
const showHeroes = ref<boolean>(false);

const titlePage = computed(() => (!showHeroes.value ? 'Cavaleiros' : 'Heróis'));

onMounted(() => {
	onLoadKnights();
});

const onLoadKnights = async () => {
	const resource = showHeroes.value ? '/knights?filter=heroes' : '/knights';
	await $api
		.get<Knight[]>(resource)
		.then((response) => {
			knights.value = response.data;
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};

const onDeleteKnight = async (id: string) => {
	const confirmDeletion = window.confirm(
		'Deseja realmente excluir esse cavaleiro?',
	);

	if (!confirmDeletion) return;

	const resource = `/knights/${id}`;
	await $api
		.delete(resource)
		.then(({ status }) => {
			if (status === 200) {
				const knightIndex = knights.value.findIndex(
					(knight) => knight._id === id,
				);
				knights.value.splice(knightIndex, 1);
			}
		})
		.catch((response) => {
			if (response.code === 'ERR_NETWORK') {
				alert('Servidor offline');
			}
		});
};

const onRedirectToKnightPage = (id: string) => `/knights/${id}`;
</script>

<template>
	<main class="flex justify-center h-[calc(100vh-4rem)] bg-zinc-50 p-8">
		<section class="container overflow-hidden">
			<section class="flex items-center justify-between">
				<h2>Lista de {{ titlePage }}</h2>

				<div class="flex gap-3 items-center">
					<div>
						<input
							id="show-heroes"
							type="checkbox"
							v-model="showHeroes"
							@change="onLoadKnights()"
						/>

						<label for="show-heroes" class="pl-2 cursor-pointer"
							>Mostrar Heróis</label
						>
					</div>

					<NuxtLink
						to="/knights/create"
						class="bg-emerald-600 text-white px-4 py-2 rounded-sm cursor-pointer"
					>
						+ Novo
					</NuxtLink>
				</div>
			</section>

			<section
				class="bg-white border border-zinc-200 mt-6 max-h-[calc(100%-4rem)] overflow-y-auto"
			>
				<table class="w-full border-collapse">
					<thead>
						<tr class="text-zinc-800">
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Nome
							</th>
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Idade
							</th>
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Armas
							</th>
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Atributo
							</th>
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Ataque
							</th>
							<th class="p-4 text-left text-xs tracking-wider font-medium">
								Exp.
							</th>
							<th
								class="w-32 p-4 text-center text-xs tracking-wider font-medium"
							>
								Ações
							</th>
						</tr>
					</thead>
					<tbody class="border-t border-zinc-200">
						<tr
							v-for="knight in knights"
							:key="knight._id"
							class="border-b last:border-b-0 border-zinc-200 nth-[2n+1]:bg-zinc-50"
						>
							<td class="p-4 text-zinc-800 text-xs">{{ knight.name }}</td>
							<td class="p-4 text-zinc-800 text-xs">{{ knight.age }}</td>
							<td class="p-4 text-zinc-800 text-xs">
								{{ knight.weapons.length }}
							</td>
							<td class="p-4 text-zinc-800 text-xs capitalize">
								{{ knight.keyAttribute }}
							</td>
							<td class="p-4 text-zinc-800 text-xs">{{ knight.attack }}</td>
							<td class="p-4 text-zinc-800 text-xs">{{ knight.exp }}</td>
							<td>
								<div class="flex justify-center gap-1 px-4">
									<NuxtLink
										:to="onRedirectToKnightPage(knight._id)"
										class="flex items-center justify-center px-3 py-2 cursor-pointer text-xs rounded-sm text-zinc-800 font-medium border border-zinc-300"
									>
										Detalhes
									</NuxtLink>

									<button
										class="flex items-center justify-center px-3 py-2 cursor-pointer rounded-sm bg-red-500 text-white border"
										v-if="!knight.deletedAt"
										@click="onDeleteKnight(knight._id)"
									>
										<Icon name="solar:trash-bin-2-outline" />
									</button>
								</div>
							</td>
						</tr>
						<tr v-if="!knights.length">
							<td class="p-4 text-center text-sm text-zinc-600" colspan="6">
								Nenhum cavaleiro/heróis foi encontrado.
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		</section>
	</main>
</template>
