export function decimalToBinary(decimal: number) {
	const binary = (decimal >>> 0).toString(2);
	if (binary.length < 32) {
		return "0".repeat(32 - binary.length) + binary;
	}
	return binary;
}

export function binaryToDecimal(binary: string) {
	return Number.parseInt(binary, 2);
}
