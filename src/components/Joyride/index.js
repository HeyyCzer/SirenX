import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { setStatus } from "@/lib/reducers/tutorial.reducer";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { ACTIONS } from "react-joyride";
import { tv } from "tailwind-variants";

const ReactJoyride = dynamic(() => import('react-joyride'), {
	ssr: false,
})

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
	}
});

const TooltipButton = (props) => {
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

const Tooltip = ({ continuous, index, step, backProps, closeProps, primaryProps, tooltipProps }) => {
	return (
		<div className="react-joyride__tooltip bg-slate-800 rounded-lg box-border text-gray-300 max-w-full p-6 relative w-[380px]" {...tooltipProps}>
			<div className="leading-[1.4] text-left">
				{step.title && <h4 className="text-emerald-400 pb-2 font-bold">{step.title}</h4>}
				<p dangerouslySetInnerHTML={{ __html: step.content }} />
			</div>

			<div className="flex items-center justify-end gap-x-4 mt-5">
				{index > 0 && <TooltipButton {...backProps} id="back" />}
				{continuous && <TooltipButton {...primaryProps} id="next" color="primary" />}
				{!continuous && <TooltipButton {...closeProps} id="close" />}
			</div>
		</div>
	);
};

export default function Tutorial({ uid, dependent, steps, callback: tutorialCallback, ...props }) {
	const [showTutorial, setShowTutorial] = useState(false);
	const dispatch = useAppDispatch();

	const tutorialState = useAppSelector(state => state.tutorial);

	for (let step in steps) {
		step = parseInt(step)
		const stepData = steps[step]

		if (stepData.condition && !stepData.condition()) {
			steps.splice(step, 1)
		}
	}

	useEffect(() => {
		if (!uid) {
			setTimeout(() => {
				setShowTutorial(true);
			}, 3000);
			return;
		}

		if (dependent) {
			const dependentTutorial = tutorialState[dependent]
			if (!dependentTutorial) {
				setShowTutorial(false);
				return;
			}
		}

		const tutorial = tutorialState[uid];
		if (!tutorial) {
			setTimeout(() => {
				setShowTutorial(true);
			}, 3000);
			return;
		}
	}, [dispatch, tutorialState, uid, dependent]);

	const callback = useCallback((data) => {
		tutorialCallback && tutorialCallback(data);
		
		if (!uid) return;
		
		if (data.action === ACTIONS.RESET) {
			dispatch(setStatus({ key: uid, value: true}));
		}
	}, [tutorialCallback, uid, dispatch])

	return (
		<ReactJoyride
			run={showTutorial}
			callback={callback}
			locale={{
				back: "Back",
				close: "Close",
				last: "Done",
				next: "Next",
				skip: "Skip",
			}}
			
			hideCloseButton
			disableScrolling
			disableScrollParentFix

			{...props}

			steps={steps}
			tooltipComponent={Tooltip}

			styles={{
				options: {
					arrowColor: "var(--color-slate-800)",
					backgroundColor: "var(--color-slate-800)",
					textColor: "var(--color-gray-300)",
					overlayColor: "rgba(0, 0, 0, 0.6)",
					primaryColor: "var(--color-emerald-400)",
					zIndex: 1000,
				},
			}}
		/>
	);
}