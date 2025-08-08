<script lang="ts">
	import { records } from '$lib/records.svelte';
	import { toast } from 'svelte-sonner';
	import { time } from '$lib/utils';
	import { get } from 'svelte/store';
	import { Check, Copy, Download, Trash, X } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { onMount } from 'svelte';

	let copyStatus = $state(false);
	let clearButton = $state(false);

	const remove = (index: number) => {
		records.update((items) => {
			items.splice(index, 1);
			return items;
		});
	};

	const clearData = () => {
		records.set([]);
		toast.success('Data cleared successfully');
		clearButton = false;
	};

	const createCsv = () => {
		let items = get(records);
		const csvContent = items.map((item) => `${item.data}`).join('\n');
		return csvContent;
	};

	const download = () => {
		copyStatus = true;
		toast.info('Generating CSV...', {
			onAutoClose: () => {
				copyStatus = false;
			}
		});

		const blob = new Blob([createCsv()], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.setAttribute('download', 'records.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const copyToClipboard = () => {
		copyStatus = true;
		const csvContent = createCsv();
		navigator.clipboard
			.writeText(csvContent)
			.then(() => {
				toast.success('Copied to clipboard', {
					onAutoClose: () => {
						copyStatus = false;
					}
				});
			})
			.catch((err) => {
				toast.error('Failed to copy: ', err);
			});
	};

	// onMount(() => {
	// 	records.update((items) => {
	// 		for (let i = 0; i < 40; i++) {
	// 			items.push({
	// 				data: 'Sample Data' + (i + 1),
	// 				date: new Date()
	// 			});
	// 		}
	// 		return items;
	// 	});
	// });
</script>

<svelte:head>
	<title>History</title>
</svelte:head>

<AlertDialog.Root bind:open={clearButton}>
	<!-- <AlertDialog.Trigger>Open</AlertDialog.Trigger> -->
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone. This will permanently remove your records data from the servers.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={clearData}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<div class="mt-16 mb-16 w-full">
	<div class="fixed top-0 mb-4 flex h-16 w-full items-center justify-between border-b border-slate-400 bg-white px-6">
		<Button variant="ghost" class="mr-auto flex flex-col gap-0 p-0">
			<h1 class="mr-auto text-sm font-bold xl:text-xl">RECORDS</h1>
			<p class="w-16 rounded bg-amber-200 text-xxs">No Group</p>
		</Button>
		<div class="flex gap-2">
			<Button
				size="sm"
				variant="secondary"
				disabled={copyStatus}
				class="cursor-pointer p-3  text-xs font-semibold"
				onclick={() => {
					clearButton = true;
				}}><Trash class="text-destructive" /> Clear</Button
			>
			<Button size="sm" variant="secondary" disabled={copyStatus} class="cursor-pointer p-3 text-xs font-semibold" onclick={download}><Download class="text-sky-700" /> CSV</Button>
			<Button size="sm" variant="secondary" disabled={copyStatus} class="cursor-pointer p-3 text-xs font-semibold" onclick={copyToClipboard}>
				{#if copyStatus}
					<Check class="text-lime-700" />
				{:else}
					<Copy class="text-sky-700" />
				{/if}
				Copy</Button
			>
		</div>
		<div></div>
	</div>

	{#if $records.length === 0}
		<div class="flex w-full items-center justify-center py-8">
			<p class="text-xs font-semibold xl:text-sm">No Records.</p>
		</div>
	{/if}

	{#each $records.reverse() as item, index}
		<div class="mx-6 flex items-center justify-between border-b py-2">
			<p class="w-1/2 text-xs xl:text-sm">{item.data}</p>
			<p class="w-1/2 text-xs font-light xl:text-sm">{time(item.date)}</p>
			<Button variant="outline" class="cursor-pointer" onclick={() => remove(index)}><X class="size-4 text-destructive" /></Button>
		</div>
	{/each}
</div>
