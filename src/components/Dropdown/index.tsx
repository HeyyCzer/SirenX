import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { twMerge } from "tailwind-merge";

const contentCn =
	"min-w-[220px] rounded-md bg-slate-800 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade";

const baseItemCn =
	"group relative select-none rounded-[3px] px-[5px] pl-[25px] text-[13px] text-gray-200 leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-600/50 data-[disabled]:text-gray-400 data-[highlighted]:text-white";

export const Dropdown = {
	Root: DropdownMenu.Root,
	Trigger: DropdownMenu.Trigger,
	Portal: DropdownMenu.Portal,
	Separator: DropdownMenu.Separator,
	Sub: DropdownMenu.Sub,

	Content: ({ className, ...props }: DropdownMenu.DropdownMenuContentProps) => (
		<DropdownMenu.Content className={twMerge(contentCn, className)} {...props} />
	),

	SubContent: ({ className, ...props }: DropdownMenu.DropdownMenuSubContentProps) => (
		<DropdownMenu.SubContent className={twMerge("ml-1", contentCn, className)} {...props} />
	),

	Item: ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => (
		<DropdownMenu.Item
			className={twMerge(baseItemCn, "flex h-[25px] items-center", className)}
			{...props}
		/>
	),

	BlockItem: ({ className, ...props }: DropdownMenu.DropdownMenuItemProps) => (
		<DropdownMenu.Item className={twMerge(baseItemCn, "py-1", className)} {...props} />
	),

	SubTrigger: ({ children, className, ...props }: DropdownMenu.DropdownMenuSubTriggerProps) => (
		<DropdownMenu.SubTrigger
			className={twMerge(
				baseItemCn,
				"flex h-[25px] items-center data-[highlighted]:data-[state=open]:bg-slate-600/50 data-[highlighted]:data-[state=open]:text-white data-[highlighted]:bg-slate-600/50 data-[state=open]:bg-slate-600/80 data-[highlighted]:text-white data-[state=open]:text-gray-200",
				className,
			)}
			{...props}
		>
			{children}
			<div className="ml-auto pl-[20px] text-gray-400 group-data-[disabled]:text-gray-400 group-data-[highlighted]:text-white">
				<FontAwesomeIcon icon={faChevronRight} />
			</div>
		</DropdownMenu.SubTrigger>
	),
};

export const activeItemCn =
	"bg-emerald-400/30 text-emerald-400 data-[highlighted]:bg-emerald-400/20 data-[highlighted]:text-emerald-500";
