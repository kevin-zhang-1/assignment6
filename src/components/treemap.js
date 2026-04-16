import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2 } from "d3";

export function TreeMap(props) {
    const { margin, svg_width, svg_height, tree } = props;

    const innerWidth = svg_width - margin.left - margin.right;
    const innerHeight = svg_height - margin.top - margin.bottom;

    // ✅ hierarchy
    const root = hierarchy(tree)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // ✅ treemap layout
    treemap()
        .size([innerWidth, innerHeight])
        .paddingInner(2)
        .paddingOuter(4)(root);

    // ✅ color
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
                            {/* ✅ RECTANGLES (parent + child) */}
                            <rect
                                x={d.x0}
                                y={d.y0}
                                width={width}
                                height={height}
                                fill={d.depth === 1 ? color(d.data.name) : "none"}
                                stroke="#333"
                                strokeWidth={d.depth === 0 ? 2 : 1}

                                // ✅ HOVER EFFECT
                                onMouseOver={(e) => {
                                    e.target.setAttribute("fill", "red");
                                }}
                                onMouseOut={(e) => {
                                    e.target.setAttribute(
                                        "fill",
                                        d.depth === 1 ? color(d.data.name) : "none"
                                    );
                                }}
                            />

                            {/* ✅ TEXT (only for leaves) */}
                            {d.depth === 2 && width > 50 && height > 30 && (
                                <text
                                    x={d.x0 + 5}
                                    y={d.y0 + 15}
                                    fontSize="12px"
                                    fill="white"
                                >
                                    {d.data.name}: {d.value}
                                </text>
                            )}

                            {/* ✅ BIG LABEL (category like heart_disease: 0) */}
                            {d.depth === 1 && (
                                <text
                                    x={(d.x0 + d.x1) / 2}
                                    y={(d.y0 + d.y1) / 2}
                                    textAnchor="middle"
                                    fontSize="30px"
                                    fill="black"
                                    opacity={0.3}
                                >
                                    {d.data.name}
                                </text>
                            )}
                        </g>
                    );
                })}

            </g>
        </svg>
    );
}