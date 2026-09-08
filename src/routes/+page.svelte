<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Scanner from '$lib/components/scanner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { records } from '$lib/records.svelte';
	import { wsConnection } from '$lib/websocket.svelte';
	import { Check, Delete, History, ScanBarcode, TypeOutline, Settings } from '@lucide/svelte';

	let scanning = $state(false);
	let status = $state('idle');
	let manual = $state(false);
	let value = $state('');
	let showSettings = $state(false);
	let ipInput = $state(wsConnection.ip);

	const keys = [
		['1', '2', '3'],
		['4', '5', '6'],
		['7', '8', '9'],
		['Backspace', '0', 'Enter']
	];

	let handlePress = (key: string) => {
		if (key === 'Backspace') {
			value = value.slice(0, -1);
		} else if (key === 'Enter') {
			manualHandler();
		} else {
			value += key;
		}
	};

	let scanHandler = (e: string) => {
		records.update((items) => {
			return [{ data: e, date: new Date() }, ...items];
		});
		wsConnection.send(e);
		status = 'success';
		scanning = false;
	};

	let manualHandler = () => {
		if (!value.length) {
			toast.error('Please type order number');
			return;
		}
		records.update((items) => {
			return [{ data: value, date: new Date() }, ...items];
		});
		wsConnection.send(value);
		toast.info(value);
		status = 'success';
		manual = false;
		value = '';
	};
</script>

<svelte:head>
	<title>Scanner</title>
</svelte:head>

<Drawer.Root bind:open={showSettings}>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>PC Connection</Drawer.Title>
			<Drawer.Description>Status: {wsConnection.status}</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<div class="mb-4 flex w-full flex-col gap-3 pr-2">
				<input type="text" bind:value={ipInput} class="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" placeholder="192.168.1.42" />
			</div>
			<Button
				class="w-full"
				onclick={() => {
					wsConnection.connect(ipInput);
				}}
			>
				Connect
			</Button>
			<Drawer.Close class="bg-primary py-4 text-primary-foreground">CLose</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

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
			<div class="flex h-7 items-center text-[25px] font-semibold tracking-wider text-blue-600">{value}</div>
			<Separator />
			<div class="mb-4 flex w-full flex-col gap-3 pr-2">
				{#each keys as row}
					<div class="flex gap-3">
						{#each row as key (key)}
							<Button
								variant="secondary"
								class="h-24 w-1/3 cursor-pointer text-[32px] font-bold shadow transition-colors ease-in-out hover:bg-slate-300 active:bg-slate-300"
								onclick={(e) => {
									e.stopImmediatePropagation();
									handlePress(key);
								}}
							>
								{#if key === 'Backspace'}
									<Delete class="size-8 text-red-500" />
								{:else if key === 'Enter'}
									<Check class="size-8 text-green-500" />
								{:else}
									{key}
								{/if}</Button
							>
						{/each}
					</div>
				{/each}
			</div>
			<Drawer.Close class="bg-primary py-4 text-primary-foreground">Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<div class="absolute top-10 left-0 flex w-full flex-col items-center justify-center text-xxs">
	<History class="size-8 text-blue-500" />
	Recent

	<div class="flex w-1/2 flex-col items-center gap-2 pt-4">
		{#each $records.slice(0, 5) as record}
			<div class="flex w-full items-center justify-between border-b border-slate-400 font-medium last:border-none">
				<span class="text-center text-blue-700 tabular-nums">{record.data}</span>
				<span class="text-center text-blue-700">{record.date.toLocaleString()}</span>
			</div>
		{/each}
	</div>
</div>

<Scanner bind:scanning oncaptured={scanHandler} />

<div class="absolute bottom-40 z-40 flex w-screen flex-col items-center justify-center gap-8" in:fade={{ duration: 200 }}>
	<div class="flex flex-col items-center gap-1">
		<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (showSettings = true)}><Settings class="size-8" /></Button>
		<p class="text-xxs">{wsConnection.status === 'connected' ? '🟢' : '🔴'}</p>
	</div>
	<div class="flex flex-col items-center gap-1">
		<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (manual = true)}><TypeOutline class="size-8" /></Button>
		<p class="text-xxs">Type</p>
	</div>
	<div class="flex flex-col items-center gap-1">
		<Button variant="secondary" class="h-14 w-16 cursor-pointer shadow" onclick={() => (scanning = true)}><ScanBarcode class="size-8" /></Button>
		<p class="text-xxs">Scanner</p>
	</div>
</div>
