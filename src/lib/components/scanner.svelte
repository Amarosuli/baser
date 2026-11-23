<script lang="ts">
	import { Html5Qrcode, Html5QrcodeSupportedFormats, type Html5QrcodeResult } from 'html5-qrcode';
	import { X, LoaderCircle, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	interface Props {
		scanning?: boolean;
		oncaptured: (data: string) => void;
	}

	let { scanning = $bindable(false), oncaptured }: Props = $props();
	let torchSupported = $state(false);
	let torchOn = $state(false);
	let html5Qrcode: Html5Qrcode;
	let isLoading: boolean = $state(false);
	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	onMount(init);
	const SupportedFormat = [Html5QrcodeSupportedFormats.CODE_128];
	function init() {
		html5Qrcode = new Html5Qrcode('reader', { formatsToSupport: SupportedFormat, verbose: true });
	}

	async function toggleTorch() {
		const torch = html5Qrcode.getRunningTrackCameraCapabilities().torchFeature();
		if (!torch.isSupported()) return;
		torchOn = !torchOn;
		await torch.apply(torchOn);
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
				const torch = html5Qrcode.getRunningTrackCameraCapabilities().torchFeature();
				torchSupported = torch.isSupported();
				isLoading = false;
			});
	}

	function stop() {
		html5Qrcode.stop().then(() => {
			scanning = false;
		});
	}

	async function onScanSuccess(decodeText: string, decodeResult: Html5QrcodeResult) {
		toast.info(decodeText);
		oncaptured(JSON.parse(decodeText));
		await delay(1000);
		// stop();
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
	{#if torchSupported}
		<Button variant="outline" size="icon" onclick={toggleTorch} class="fixed bottom-40 rounded-full bg-yellow-100/50"><Sun class="h-8 w-8 text-yellow-300" /></Button>
	{/if}
</div>
