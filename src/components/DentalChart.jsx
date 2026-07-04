import React from "react";
import Tooth from "./tooth";
import { toothPaths } from "./settings/toothPaths";

export default function DentalChart({ selectedTeeth, onToothClick, filteredTeeth, showAllQuadrants }) {
    const showUpper = showAllQuadrants || filteredTeeth.some(t => t.jawType === 'UR' || t.jawType === 'UL');
    const showLower = showAllQuadrants || filteredTeeth.some(t => t.jawType === 'LR' || t.jawType === 'LL');
    const UpperTeeths = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28];
    const LowerTeeths = [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48];

    let viewBox = "0 0 289.61084 370.54398";
    if (showUpper && !showLower) {
        viewBox = "0 0 289.61084 190";
    }
    if (!showUpper && showLower) {
        viewBox = "0 180 289.61084 190";
    }

    return (
        <svg
            viewBox={viewBox}
            width="100%"
            height="100%"
        >
            {showUpper && (
                <>
                    {UpperTeeths.map((t) => (
                        <Tooth
                            key={t}
                            number={t}
                            selectedTeeth={selectedTeeth}
                            onToothClick={onToothClick}
                        >
                            {toothPaths[t]}
                        </Tooth>
                    ))}
                </>
            )}

            {showLower && (
                <>
                    {LowerTeeths.map((t) => (
                        <Tooth
                            key={t}
                            number={t}
                            selectedTeeth={selectedTeeth}
                            onToothClick={onToothClick}
                        >
                            {toothPaths[t]}
                        </Tooth>
                    ))}
                </>
            )}
        </svg>
    );
}