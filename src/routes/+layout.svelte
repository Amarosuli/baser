<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '../app.css';
	import { Database, TextCursorInput, UserLock } from '@lucide/svelte';

	let { children } = $props();
</script>

<Toaster richColors position="top-right" />

{@render children()}

<nav class="fixed bottom-0 z-20 flex h-16 w-screen items-center justify-between bg-primary text-primary-foreground">
	<div class="flex h-full w-full items-center justify-center">
		<button class="flex h-full w-full cursor-pointer items-center justify-center font-semibold transition-all ease-out hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/history' ? 'bg-sky-200/20 text-sky-400' : ''}" onclick={() => goto('history')}><Database /></button>
	</div>
	<div class="flex h-full w-full items-center justify-center">
		<button class="flex h-full w-full cursor-pointer items-center justify-center font-semibold transition-all ease-out hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/' ? 'bg-sky-200/20 text-sky-400' : ''}" onclick={() => goto('/')}><TextCursorInput /></button>
	</div>
	<div class="flex h-full w-full items-center justify-center">
		<button class="flex h-full w-full cursor-pointer items-center justify-center font-semibold transition-all ease-out hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/login' ? 'bg-sky-200/20 text-sky-400' : ''}" onclick={() => goto('login')}><UserLock /></button>
	</div>
</nav>
