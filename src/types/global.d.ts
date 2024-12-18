interface Window {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	gtag: (type: string, extra: string, options: any) => void;
}