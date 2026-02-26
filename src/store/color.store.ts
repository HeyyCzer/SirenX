import { create } from "zustand";

interface ColorState {
	colors: {
		[key: string]: {
			toolbar: {
				name: string;
				default: string;
				selected: string;
				unlisted?: boolean;
			};
			editor: {
				default: string;
				current: string;
			};
			carcols: {
				color: string;
			};
			css?: {
				rgb: {
					r: number;
					g: number;
					b: number;
				};
				textColor: string;
				varPrefix: string;
			};
		};
	};
}

export const useColorStore = create<ColorState>()(
	(set) => ({
		colors: {
			red: {
				toolbar: {
					name: "Red",
					default: "bg-red-500/50 hover:bg-red-500 text-white",
					selected: "bg-red-500 text-white",
				},
				editor: {
					default: "bg-red-500/50",
					current: "bg-red-500 drop-shadow-[0px_0px_10px_#ff0000]",
				},
				carcols: {
					color: "0xFFFF0000",
				}
			},
			blue: {
				toolbar: {
					name: "Blue",
					default: "bg-blue-500/50 hover:bg-blue-500 text-white",
					selected: "bg-blue-500 text-white",
				},
				editor: {
					default: "bg-blue-500/50",
					current: "bg-blue-500 drop-shadow-[0px_0px_10px_#0000ff]",
				},
				carcols: {
					color: "0xFF0000FF",
				}
			},
			white: {
				toolbar: {
					name: "White",
					default: "bg-white/50 hover:bg-white text-black",
					selected: "bg-white text-black",
				},
				editor: {
					default: "bg-white/50",
					current: "bg-white drop-shadow-[0px_0px_10px_#ffffff]",
				},
				carcols: {
					color: "0xFFFFFFFF",
				}
			},
			amber: {
				toolbar: {
					name: "Amber",
					default: "bg-amber-500/50 hover:bg-amber-500 text-white",
					selected: "bg-amber-500 text-white",
				},
				editor: {
					default: "bg-amber-500/50",
					current: "bg-amber-500 drop-shadow-[0px_0px_10px_#ffbf00]",
				},
				carcols: {
					color: "0xFFFFBF00",
				}
			},
			purple: {
				toolbar: {
					name: "Purple",
					default: "bg-purple-500/50 hover:bg-purple-500 text-white",
					selected: "bg-purple-500 text-white",
				},
				editor: {
					default: "bg-purple-500/50",
					current: "bg-purple-500 drop-shadow-[0px_0px_10px_#800080]",
				},
				carcols: {
					color: "0xFF800080",
				}
			},
			green: {
				toolbar: {
					name: "Green",
					default: "bg-green-500/50 hover:bg-green-500 text-white",
					selected: "bg-green-500 text-white",
				},
				editor: {
					default: "bg-green-500/50",
					current: "bg-green-500 drop-shadow-[0px_0px_10px_#008000]",
				},
				carcols: {
					color: "0xFF008000",
				}
			},
			lightBlue: {
				toolbar: {
					name: "Light Blue",
					default: "bg-blue-400/50 hover:bg-blue-400 text-white",
					selected: "bg-blue-400 text-white",
				},
				editor: {
					default: "bg-blue-400/50",
					current: "bg-blue-400 drop-shadow-[0px_0px_10px_#0000ff]",
				},
				carcols: {
					color: "0xFF0000FF",
				}
			},
			pink: {
				toolbar: {
					name: "Pink",
					default: "bg-pink-500/50 hover:bg-pink-500 text-white",
					selected: "bg-pink-500 text-white",
				},
				editor: {
					default: "bg-pink-500/50",
					current: "bg-pink-500 drop-shadow-[0px_0px_10px_#ff00ff]",
				},
				carcols: {
					color: "0xFFFF00FF",
				}
			},
			_fallback: {
				toolbar: {
					name: "Fallback",
					default: "bg-pink-200/50 hover:bg-pink-200 text-black animate-pulse",
					selected: "bg-pink-200 text-black",
					unlisted: true,
				},
				editor: {
					default: "border border-emerald-400/50 animate-pulse",
					current: "border border-emerald-400/50 animate-pulse",
				},
				carcols: {
					color: "0xFF00FF00",
				}
			},
			none: {
				toolbar: {
					name: "None",
					default: "",
					selected: "",
					unlisted: true,
				},
				editor: {
					default: "bg-gray-200/20",
					current: "bg-gray-200/20",
				},
				carcols: {
					color: "0x00000000",
				}
			},
		},
	}),
);
