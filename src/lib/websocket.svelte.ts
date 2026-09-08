import { browser } from '$app/environment';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const STORAGE_KEY = 'pc-ws-ip';
const WS_PORT = 7878;

function createWsConnection() {
	let socket: WebSocket | null = null;
	let status = $state<ConnectionStatus>('disconnected');
	let ip = $state(browser ? (localStorage.getItem(STORAGE_KEY) ?? '') : '');

	function connect(newIp?: string) {
		if (newIp) {
			ip = newIp.trim();
			if (browser) localStorage.setItem(STORAGE_KEY, ip);
		}
		if (!ip) return;

		socket?.close();
		status = 'connecting';

		socket = new WebSocket(`ws://${ip}:${WS_PORT}/ws`);

		socket.onopen = () => {
			status = 'connected';
		};
		socket.onclose = () => {
			status = 'disconnected';
		};
		socket.onerror = () => {
			status = 'error';
		};
	}

	function disconnect() {
		socket?.close();
		socket = null;
		status = 'disconnected';
	}

	function send(value: string) {
		if (socket?.readyState === WebSocket.OPEN) {
			socket.send(value);
		}
		// silently no-op if not connected — scanning should never block on this
	}

	return {
		get status() {
			return status;
		},
		get ip() {
			return ip;
		},
		connect,
		disconnect,
		send
	};
}

export const wsConnection = createWsConnection();
