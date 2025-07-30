<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();
</script>

<Toaster />

{@render children()}

<nav class="fixed bottom-0 z-20 flex h-16 w-screen items-center justify-between bg-primary text-primary-foreground">
	<div class="flex h-full w-full items-center justify-center">
		<button class="h-full w-full cursor-pointer font-semibold hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/history' ? 'bg-primary-foreground/10' : ''}" onclick={() => goto('history')}>History</button>
	</div>
	<div class="flex h-full w-full items-center justify-center">
		<button class="h-full w-full cursor-pointer font-semibold hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/' ? 'bg-primary-foreground/10' : ''}" onclick={() => goto('/')}>Scanner</button>
	</div>
	<div class="flex h-full w-full items-center justify-center">
		<button class="h-full w-full cursor-pointer font-semibold hover:bg-primary-foreground/10 active:bg-primary-foreground/10 {page.url.pathname === '/login' ? 'bg-primary-foreground/10' : ''}" onclick={() => goto('login')}>Login</button>
	</div>
</nav>
