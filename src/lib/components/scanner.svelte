<script lang="ts">
	import { Html5Qrcode, Html5QrcodeSupportedFormats, type Html5QrcodeResult } from 'html5-qrcode';
	import { X, LoaderCircle } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	interface Props {
		scanning?: boolean;
		oncaptured: (data: string) => void;
	}

	let { scanning = $bindable(false), oncaptured }: Props = $props();
	let html5Qrcode: Html5Qrcode;
	let isLoading: boolean = $state(false);

	onMount(init);
	const SupportedFormat = [Html5QrcodeSupportedFormats.CODE_128];
	function init() {
		html5Qrcode = new Html5Qrcode('reader', { formatsToSupport: SupportedFormat, verbose: true });
	}

	function start() {
		isLoading = true;
		html5Qrcode
			.start(
				{ facingMode: 'environment' },
				{
					fps: 15,
					qrbox: { width: 300, height: 200 }
				},
				onScanSuccess,
				onScanFailure
			)
			.then(() => {
				isLoading = false;
			});
	}

	function stop() {
		html5Qrcode.stop().then(() => {
			scanning = false;
		});
	}

	function onScanSuccess(decodeText: string, decodeResult: Html5QrcodeResult) {
		toast.info(decodeText);
		oncaptured(JSON.parse(decodeText));
		stop();
	}

	function onScanFailure(error: string) {
		// log here
		// toast.info(error);
	}

	$effect(() => {
		if (scanning) start();
	});
</script>

<div class:hidden={!scanning} class="fixed inset-0 isolate z-50 flex w-full flex-col items-center justify-center bg-foreground backdrop-blur-md">
	{#if isLoading}
		<LoaderCircle class="h-8 w-8 animate-spin" />
	{/if}
	<reader id="reader" class="relative flex w-full max-w-[500px] items-center justify-center"></reader>
	<Button variant="outline" size="icon" onclick={stop} class="fixed bottom-32 rounded-full bg-yellow-100/50"><X class="h-8 w-8 text-yellow-300" /></Button>
</div>
