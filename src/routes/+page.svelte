<script lang="ts">
	import { ScanBarcode } from '@lucide/svelte';
	import { records } from '$lib/records.svelte';
	import Scanner from '$lib/components/scanner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let scanning = $state(false);
	let handler = (e: string) => {
		records.update((items) => {
			return [...items, { data: e, date: new Date() }];
		});
		status = 'success';
		scanning = false;
	};
	let status = $state('idle');
</script>

<Scanner bind:scanning oncaptured={handler} />

<div class="absolute bottom-40 z-40 flex w-screen flex-col items-center justify-center gap-4">
	<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (scanning = true)}><ScanBarcode class="size-8" /></Button>
</div>
