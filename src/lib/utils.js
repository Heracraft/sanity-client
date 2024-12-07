import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}