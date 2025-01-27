<script setup lang="ts">
defineProps({
	value: {
		type: Number,
		required: true,
		validator: (v: number) => v >= 0 && v <= 10,
	},
});
</script>

<template>
	<div class="flex flex-col gap-2 w-full max-w-sm">
		<div class="grid grid-cols-10 gap-1">
			<div
				v-for="n in 10"
				:key="n"
				class="h-1.5 rounded transition-all duration-100"
				:class="{
					'bg-emerald-600': value >= n,
					'bg-zinc-200': value < n,
				}"
			></div>
		</div>
	</div>
</template>
