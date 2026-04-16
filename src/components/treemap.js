import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2 } from "d3";

export function TreeMap(props) {
    const { margin, svg_width, svg_height, tree } = props;

    const innerWidth = svg_width - margin.left - margin.right;
    const innerHeight = svg_height - margin.top - margin.bottom;

    // ✅ Build hierarchy
    const root = hierarchy(tree)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // ✅ Treemap layout (clean subdivision)
    treemap()
        .size([innerWidth, innerHeight])
        .paddingInner(2)
        .paddingOuter(2)(root);

    // ✅ Color scale
    const color = scaleOrdinal(schemeDark2);

    const nodes = root.descendants();

    return (
        <svg
            viewBox={`0 0 ${svg_width} ${svg_height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>

                {nodes.map((d, i) => {
                    const width = d.x1 - d.x0;
                    const height = d.y1 - d.y0;

                    return (
                        <g key={i}>
                            {/* ✅ RECTANGLES */}
                            <rect
                                x={d.x0}
                                y={d.y0}
                                width={width}
                                height={height}
                                fill={
                                    d.depth === 1
                                        ? color(d.data.name)
                                        : d.depth === 2
                                        ? color(d.parent.data.name)
                                        : "none"
                                }

                                // ✅ BORDER LOGIC (FIXED)
                                stroke={
                                    d.depth === 1
                                        ? "#333"        // big rectangle border
                                        : d.depth === 2
                                        ? "white"       // inner subdivision lines
                                        : "none"
                                }
                                strokeWidth={
                                    d.depth === 1
                                        ? 2             // strong outer border
                                        : d.depth === 2
                                        ? 1             // subtle inner lines
                                        : 0
                                }

                                // ✅ HOVER (unchanged)
                                onMouseOver={(e) => {
                                    if (d.depth === 2) {
                                        e.target.setAttribute("fill", "red");
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (d.depth === 2) {
                                        e.target.setAttribute(
                                            "fill",
                                            color(d.parent.data.name)
                                        );
                                    }
                                }}
                            />

                            {/* ✅ BIG GROUP LABEL (e.g., heart_disease: 0) */}
                            {d.depth === 1 && (
                                <text
                                    x={(d.x0 + d.x1) / 2}
                                    y={(d.y0 + d.y1) / 2}
                                    textAnchor="middle"
                                    fontSize="26px"
                                    fill="black"
                                    opacity={0.25}
                                >
                                    {d.data.name}
                                </text>
                            )}

                            {/* ✅ DETAILED TEXT (leaf nodes) */}
                            {d.depth === 2 && width > 80 && height > 50 && (
                                <text
                                    x={d.x0 + 5}
                                    y={d.y0 + 15}
                                    fontSize="12px"
                                    fill="white"
                                >
                                    <tspan x={d.x0 + 5} dy="0">
                                        {d.data.name}
                                    </tspan>

                                    {/* 🔥 Add explanatory attributes */}
                                    {d.data.gender && (
                                        <tspan x={d.x0 + 5} dy="1.2em">
                                            gender: {d.data.gender}
                                        </tspan>
                                    )}

                                    {d.data.ever_married && (
                                        <tspan x={d.x0 + 5} dy="1.2em">
                                            ever_married: {d.data.ever_married}
                                        </tspan>
                                    )}

                                    {d.data.heart_disease !== undefined && (
                                        <tspan x={d.x0 + 5} dy="1.2em">
                                            heart_disease: {d.data.heart_disease}
                                        </tspan>
                                    )}

                                    <tspan x={d.x0 + 5} dy="1.2em">
                                        Value: {d.value}
                                    </tspan>

                                    <tspan x={d.x0 + 5} dy="1.2em">
                                        ({((d.value / d.parent.value) * 100).toFixed(1)}%)
                                    </tspan>
                                </text>
                            )}
                        </g>
                    );
                })}

            </g>
        </svg>
    );
}