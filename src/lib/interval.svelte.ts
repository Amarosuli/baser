import { createSubscriber } from 'svelte/reactivity';

type duration = number | (() => number);

export class Interval {
	#duration_input: duration = () => 0;
	#subscribe;
	#update: () => void = () => {};

	#duration = $derived(typeof this.#duration_input === 'function' ? this.#duration_input() : this.#duration_input);
	#interval = $derived(setInterval(() => this.#update?.(), this.#duration));

	constructor(duration: duration) {
		this.#duration_input = duration;

		this.#subscribe = createSubscriber((update: () => void) => {
			this.#update = update;
			return () => clearInterval(this.#interval);
		});
	}

	get current() {
		this.#interval;
		this.#subscribe();
		return new Date();
	}

	get duration() {
		return this.#duration;
	}

	set duration(value) {
		clearInterval(this.#interval);
		this.#duration_input = value;
	}
}
