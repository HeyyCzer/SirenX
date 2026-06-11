import { useCallback, useEffect, useState } from "react";
import { ACTIONS, type EventData, Joyride } from "react-joyride";
import { tv, type VariantProps } from "tailwind-variants";
import { useTutorialStore } from "@/store/tutorial.store";

const button = tv({
	base: "py-1 px-2 transition-colors border-0 rounded-md text-white cursor-pointer outline-none appearance-none",
	variants: {
		color: {
			default: "bg-transparent hover:bg-gray-100/10",
			primary: "bg-emerald-400/30 hover:bg-emerald-400/60",
		},
	},
	defaultVariants: {
		color: "default",
	},
});

type ButtonVariants = VariantProps<typeof button>;

const TooltipButton = (
	props: ButtonVariants & { title: string; className?: string },
) => {
	return (
		<button
			type="button"
			{...props}
			className={button({ color: props.color, className: props.className })}
		>
			{props.title}
		</button>
	);
};

export interface TooltipProps {
	continuous: boolean;
	index: number;
	step: any;
	backProps: any;
	closeProps: any;
	primaryProps: any;
	tooltipProps: any;
}

const Tooltip = ({
	continuous,
	index,
	step,
	backProps,
	closeProps,
	primaryProps,
	tooltipProps,
}: TooltipProps) => {
	return (
		<div
			className="react-joyride__tooltip relative box-border w-[380px] max-w-full rounded-lg bg-slate-800 p-6 text-gray-300"
			{...tooltipProps}
		>
			<div className="text-left leading-[1.4]">
				{step.title && (
					<h4 className="pb-2 font-bold text-emerald-400">{step.title}</h4>
				)}
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: it's safe in this case */}
				<p dangerouslySetInnerHTML={{ __html: step.content }} />
			</div>

			<div className="mt-5 flex items-center justify-end gap-x-4">
				{index > 0 && <TooltipButton {...backProps} id="back" />}
				{continuous && (
					<TooltipButton {...primaryProps} id="next" color="primary" />
				)}
				{!continuous && <TooltipButton {...closeProps} id="close" />}
			</div>
		</div>
	);
};

export interface TutorialProps {
	uid: string;
	dependent?: string;
	steps: any[];
	callback?: (data: EventData) => void;
}

export default function Tutorial({
	uid,
	dependent,
	steps,
	callback: tutorialCallback,
	...props
}: TutorialProps) {
	const [showTutorial, setShowTutorial] = useState(false);
	const tutorialState = useTutorialStore();
	const setStatus = useTutorialStore((state) => state.setStatus);

	for (const stepIndex in steps) {
		const step = Number.parseInt(stepIndex, 10);
		const stepData = steps[step];

		if (stepData?.condition && !stepData.condition()) {
			steps.splice(step, 1);
		}
	}

	useEffect(() => {
		if (!uid) return;

		if (dependent) {
			const dependentTutorial = tutorialState[dependent];
			if (!dependentTutorial) {
				setShowTutorial(false);
				return;
			}
		}

		let tutorialTimeout: NodeJS.Timeout;
		const tutorial = tutorialState[uid];
		if (!tutorial) {
			tutorialTimeout = setTimeout(() => {
				setShowTutorial(true);
			}, 3000);
		}

		return () => {
			clearTimeout(tutorialTimeout);
		};
	}, [tutorialState, uid, dependent]);

	const onEvent = useCallback(
		(data: EventData) => {
			tutorialCallback?.(data);

			if (!uid) return;

			if (data.action === ACTIONS.RESET) {
				setStatus({ key: uid, value: true });
			}
		},
		[tutorialCallback, uid, setStatus],
	);

	return (
		<Joyride
			run={showTutorial}
			onEvent={onEvent}
			locale={{
				back: "Back",
				close: "Close",
				last: "Done",
				next: "Next",
				skip: "Skip",
			}}
			{...props}
			steps={steps}
			tooltipComponent={Tooltip}
			styles={{
				buttonPrimary: {
					backgroundColor: "var(--color-emerald-400)",
				},
				arrow: {
					color: "var(--color-slate-800)",
				},
				beaconInner: {
					backgroundColor: "var(--color-emerald-400)",
				},
				beaconOuter: {
					backgroundColor: "#34d39933",
					border: "2px solid var(--color-emerald-400)",
				},
			}}
			options={{
				skipBeacon: true,
				scrollOffset: 100,
			}}
			continuous
		/>
	);
}
