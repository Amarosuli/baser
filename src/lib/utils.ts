import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import ID from 'dayjs/locale/id';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

type TimeOption = {
	format: string;
};

export const time = (date: any, options?: TimeOption) => {
	if (options) return dayjs(date).locale(ID).format(options.format);
	// return dayjs(date).locale(ID).format('dddd, DD MMMM YYYY - h:mm A');
	return dayjs(date).locale(ID).format('DD MMM YYYY - h:mm A');
};
