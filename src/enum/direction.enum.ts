const DeltaEnum = {
	FRONT: {
		name: "Front",
		angle: 0,
		delta: 0.0,
		schema: [
			[null, true, null],
			[null, "CENTER", null],
			[null, null, null],
		],
	},
	RIGHT: {
		name: "Right",
		angle: 90,
		delta: -1.57079633,
		schema: [
			[null, null, null],
			[null, "CENTER", true],
			[null, null, null],
		],
	},
	BACK: {
		name: "Back",
		angle: 180,
		// biome-ignore lint/suspicious/noApproximativeNumericConstant: Needs to be a finite number
		delta: 3.14159265,
		schema: [
			[null, null, null],
			[null, "CENTER", null],
			[null, true, null],
		],
	},
	LEFT: {
		name: "Left",
		angle: -90,
		delta: 1.57079633,
		schema: [
			[null, null, null],
			[true, "CENTER", null],
			[null, null, null],
		],
	},
	FRONT_RIGHT_PASSENGER: {
		name: "Front (Right Passenger)",
		angle: 45,
		delta: -0.78539816,
		schema: [
			[null, null, true],
			[null, "CENTER", null],
			[null, null, null],
		],
	},
	BACK_RIGHT_PASSENGER: {
		name: "Back (Right Passenger)",
		angle: 135,
		delta: -2.35619449,
		schema: [
			[null, null, null],
			[null, "CENTER", null],
			[null, null, true],
		],
	},
	BACK_LEFT_DRIVER: {
		name: "Back (Left Driver)",
		angle: -135,
		delta: 2.35619449,
		schema: [
			[null, null, null],
			[null, "CENTER", null],
			[true, null, null],
		],
	},
	FRONT_LEFT_DRIVER: {
		name: "Front (Left Driver)",
		angle: -45,
		delta: 0.78539816,
		schema: [
			[true, null, null],
			[null, "CENTER", null],
			[null, null, null],
		],
	},
};

export default DeltaEnum;
