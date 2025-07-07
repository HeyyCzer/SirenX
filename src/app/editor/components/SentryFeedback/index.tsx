"use client";

import { getFeedback } from "@sentry/nextjs";
import { useEffect, useRef } from "react";

export default function FeedbackWidget() {
	const widgetRef = useRef<any>(null);

	useEffect(() => {
		const feedbackWidget = getFeedback()?.createWidget();
		widgetRef.current = feedbackWidget;

		return () => {
			if (!widgetRef.current) return;
			
			widgetRef.current?.removeFromDom();
			widgetRef.current = null;
		};
	}, []);

	return null;
}