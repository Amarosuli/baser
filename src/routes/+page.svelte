<script lang="ts">
	import { ScanBarcode, TypeOutline } from '@lucide/svelte';
	import { records } from '$lib/records.svelte';
	import Scanner from '$lib/components/scanner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	let scanning = $state(false);
	let status = $state('idle');
	let manual = $state(false);
	let value = $state('');

	let scanHandler = (e: string) => {
		records.update((items) => {
			return [...items, { data: e, date: new Date() }];
		});
		status = 'success';
		scanning = false;
	};

	let manualHandler = () => {
		if (!value.length) {
			toast.error('Please type order number');
			return;
		}
		records.update((items) => {
			return [...items, { data: value, date: new Date() }];
		});
		toast.info(value);
		status = 'success';
		manual = false;
		value = '';
	};
</script>

<svelte:head>
	<title>Scanner</title>
</svelte:head>

<Drawer.Root
	bind:open={manual}
	onOpenChange={(open) => {
		if (!open) value = '';
	}}
>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Type Order Number</Drawer.Title>
			<Drawer.Description>This input aim for MDR or any Jobcard with no barcode appear.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Input type="text" placeholder="Order Number" bind:value />
			<Separator />
			<Button onclick={manualHandler} size="lg">Save</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<Scanner bind:scanning oncaptured={scanHandler} />

<div class="absolute bottom-40 z-40 flex w-screen flex-col items-center justify-center gap-8" in:fade={{ duration: 200 }}>
	<div class="flex flex-col items-center gap-1">
		<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (manual = true)}><TypeOutline class="size-8" /></Button>
		<p class="text-xxs">Type</p>
	</div>
	<div class="flex flex-col items-center gap-1">
		<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (scanning = true)}><ScanBarcode class="size-8" /></Button>
		<p class="text-xxs">Scanner</p>
	</div>
</div>
