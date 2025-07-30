<script lang="ts">
	import { records } from '$lib/records.svelte';
	import { toast } from 'svelte-sonner';
	import { time } from '$lib/utils';
	import { get } from 'svelte/store';
	import { X } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const remove = (index: number) => {
		records.update((items) => {
			items.splice(index, 1);
			return items;
		});
	};

	const createCsv = () => {
		let items = get(records);
		const csvContent = items.map((item) => `${item.data}`).join('\n');
		return csvContent;
	};

	const download = () => {
		toast.info('Generating CSV...');
		const blob = new Blob([createCsv()], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.setAttribute('download', 'records.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const copyToClipboard = () => {
		const csvContent = createCsv();
		navigator.clipboard
			.writeText(csvContent)
			.then(() => {
				toast.info('Copied to clipboard');
			})
			.catch((err) => {
				toast.error('Failed to copy: ', err);
			});
	};
</script>

<div class="w-full">
	<div class="mb-4 flex h-14 items-center justify-between border-b border-slate-400 px-6">
		<h1 class=" text-sm font-semibold xl:text-xl">Recent Data</h1>
		<div class="flex gap-2">
			<Button size="sm" variant="secondary" class="cursor-pointer p-3 text-xs font-semibold" onclick={download}>Export CSV</Button>
			<Button size="sm" variant="secondary" class="cursor-pointer p-3 text-xs font-semibold" onclick={copyToClipboard}>Copy to Clipboard</Button>
		</div>
	</div>

	{#each $records as item, index}
		<div class="mx-6 flex items-center justify-between border-b py-2">
			<p class="w-1/2 text-xs xl:text-sm">{item.data}</p>
			<p class="w-1/2 text-xs xl:text-sm">{time(item.date)}</p>
			<Button variant="outline" class="cursor-pointer" onclick={() => remove(index)}><X class="size-4 text-destructive" /></Button>
		</div>
	{/each}
</div>
