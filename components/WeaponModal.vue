<script setup lang="ts">
import { EAttribute } from '~/common/enums/attribute.enum';
import { createWeaponSchema } from '~/common/schemas/create-weapon.schema';

const {
	defineField,
	values,
	setFieldValue,
	validate,
	errors,
	meta,
	resetForm,
} = useForm({
	validationSchema: createWeaponSchema,
	initialValues: {
		name: '',
		mod: 0,
		attr: EAttribute.STRENGTH,
		equipped: false,
	},
});
const modalStore = useModalStore();

const emits = defineEmits(['new-weapon']);

const [name] = defineField('name');
const [attribute] = defineField('attr');
const [equipped] = defineField('equipped');

const updateAttribute = (delta: number) => {
	const newValue = Math.max(0, Math.min(10, values.mod + delta));
	setFieldValue('mod', newValue);
};

const submitForm = async () => {
	const result = await validate();

	if (!result.valid) {
		console.log('Erro na validação', errors.value);
		return;
	}

	emits('new-weapon', { ...values });
	resetForm();

	modalStore.close('createWeapon');
};
</script>

<template>
	<section
		class="z-10 fixed top-0 right-0 h-screen w-full md:w-80 bg-white md:border-l border-zinc-200 shadow"
	>
		<div
			class="flex justify-between items-center gap-2 h-16 px-4 border-b border-zinc-200"
		>
			<h2>
				<Icon name="game-icons:zeus-sword" size="24" class="text-amber-600" />

				Adicionar nova arma
			</h2>

			<button
				class="flex items-center justify-center border border-zinc-200 p-2 rounded cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 text-red-400"
				@click="modalStore.close('createWeapon')"
			>
				<Icon name="bitcoin-icons:cross-filled" />
			</button>
		</div>

		<form class="flex flex-col gap-3 p-4" @submit.prevent="submitForm">
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
				<label class="text-sm">Atributo:</label>
				<select
					class="border border-zinc-200 py-2 px-3 rounded-sm text-sm"
					v-model="attribute"
				>
					<option
						:value="attribute"
						v-for="attribute in Object.values(EAttribute)"
					>
						{{ attribute }}
					</option>
				</select>
			</div>

			<div>
				<p class="text-zinc-800 font-medium text-sm capitalize mb-1">
					Modificador: (
					<span class="text-emerald-600">{{ values.mod }}</span
					>/10 )
				</p>
				<div class="flex items-center gap-2">
					<button
						type="button"
						class="bg-emerald-600 text-white min-w-6 rounded cursor-pointer"
						@click="updateAttribute(-1)"
					>
						-
					</button>
					<RatingBar :value="values.mod" />
					<button
						type="button"
						class="bg-emerald-600 text-white min-w-6 rounded cursor-pointer"
						@click="updateAttribute(1)"
					>
						+
					</button>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input id="equipped-weapon" type="checkbox" v-model="equipped" />
				<label for="equipped-weapon">Equipar</label>
			</div>

			<button
				type="submit"
				class="bg-emerald-600 text-white px-4 py-2 text-sm rounded-sm cursor-pointer disabled:bg-zinc-400"
				:disabled="!meta.valid"
			>
				Salvar
			</button>
		</form>
	</section>
</template>
