import { persisted } from 'svelte-persisted-store';

let item: { data: string; date: Date }[] = $state([]);

export const records = persisted('records', item);
