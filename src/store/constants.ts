import DeltaEnum from "@/enum/direction.enum";

export const STORE_KEY = "SirenX//";

export const defaultLightModel = {
	color: "none",
	direction: DeltaEnum.FRONT.delta,
	multiples: 1,
	intensity: 3.5,
	scaleFactor: 100,
};

export const defaultCarcolsLightModel = {
	rotation: {
		delta: {
			$: {
				value: "0.00000000",
			},
		},
		start: {
			$: {
				value: "0.00000000",
			},
		},
		speed: {
			$: {
				value: "3.00000000",
			},
		},
		sequencer: {
			$: {
				value: "4294967295",
			},
		},
		multiples: {
			$: {
				value: "1",
			},
		},
		direction: {
			$: {
				value: "false",
			},
		},
		syncToBpm: {
			$: {
				value: "true",
			},
		},
	},
	flashiness: {
		delta: {
			$: {
				value: "3.14159300",
			},
		},
		start: {
			$: {
				value: "0.00000000",
			},
		},
		speed: {
			$: {
				value: "0.00000000",
			},
		},
		sequencer: {
			$: {
				value: "2863486250",
			},
		},
		multiples: {
			$: {
				value: "2",
			},
		},
		direction: {
			$: {
				value: "true",
			},
		},
		syncToBpm: {
			$: {
				value: "true",
			},
		},
	},
	corona: {
		intensity: {
			$: {
				value: "25.00000000",
			},
		},
		size: {
			$: {
				value: "0.50000000",
			},
		},
		pull: {
			$: {
				value: "0.15000000",
			},
		},
		faceCamera: {
			$: {
				value: "false",
			},
		},
	},
	color: {
		$: {
			value: "0xFFFF9500",
		},
	},
	intensity: {
		$: {
			value: "1.00000000",
		},
	},
	lightGroup: {
		$: {
			value: "1",
		},
	},
	rotate: {
		$: {
			value: "false",
		},
	},
	scale: {
		$: {
			value: "true",
		},
	},
	scaleFactor: {
		$: {
			value: "2",
		},
	},
	flash: {
		$: {
			value: "true",
		},
	},
	light: {
		$: {
			value: "false",
		},
	},
	spotLight: {
		$: {
			value: "false",
		},
	},
	castShadows: {
		$: {
			value: "false",
		},
	},
};
