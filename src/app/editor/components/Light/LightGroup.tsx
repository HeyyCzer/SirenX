import React from "react";
import Light from ".";

interface LightGroupProps {
	rowIndex: number;
	columns: unknown[];
	currentRow: number;
}

const LightGroup = React.memo(
	({ rowIndex, columns, currentRow }: LightGroupProps) => {
		return (
			<>
				{columns.map((_, columnIndex) => (
					<Light
						// biome-ignore lint/suspicious/noArrayIndexKey: indexes are stable in this context
						key={`light-${rowIndex}-${columnIndex}`}
						row={rowIndex}
						column={columnIndex}
						isCurrent={rowIndex === currentRow}
					/>
				))}
			</>
		);
	},
);

LightGroup.displayName = "LightGroup";

export default LightGroup;
