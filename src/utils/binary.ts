export function decimalToBinary(decimal: number, length = 32) {
	const binary = (decimal >>> 0).toString(2);
	if (binary.length < length) {
		return "0".repeat(length - binary.length) + binary;
	}
	return binary;
}

export function binaryToDecimal(binary: string) {
	return Number.parseInt(binary, 2);
}
