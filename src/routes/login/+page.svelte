<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div in:fade={{ delay: 400 }} class="absolute inset-0 z-20 flex items-center justify-center bg-transparent pt-2 pr-1 text-3xl font-extrabold text-yellow-500">Under Construction</div>
<div in:fade={{ delay: 200 }} class="absolute inset-0 z-20 flex items-center justify-center bg-transparent text-3xl font-extrabold text-slate-800">Under Construction</div>
<div in:fade class="absolute inset-0 z-10 bg-amber-300/50 backdrop-blur-sm"></div>
<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm />
</div>
