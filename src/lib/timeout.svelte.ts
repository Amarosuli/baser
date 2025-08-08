import { createSubscriber } from 'svelte/reactivity';

type duration = number | (() => number);

export class Timeout {
	#duration_input: duration = () => 0;
	#subscribe;
	#update: () => void = () => {};

	#duration = $derived(typeof this.#duration_input === 'function' ? this.#duration_input() : this.#duration_input);
	#timeout = $derived(setTimeout(() => this.#update?.(), this.#duration));

	constructor(duration: duration) {
		this.#duration_input = duration;

		this.#subscribe = createSubscriber((update: () => void) => {
			this.#update = update;
			return () => clearInterval(this.#timeout);
		});
	}

	get current() {
		this.#timeout;
		this.#subscribe();
		return;
	}

	get duration() {
		return this.#duration;
	}

	set duration(value) {
		clearInterval(this.#timeout);
		this.#duration_input = value;
	}
}
