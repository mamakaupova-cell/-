/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GeometryDiagramData } from '../types/qmzh';

interface GeometryCanvasProps {
  diagram: GeometryDiagramData;
  width?: number;
  height?: number;
  className?: string;
  showTitle?: boolean;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
  diagram,
  width = 340,
  height = 220,
  className = '',
  showTitle = true,
}) => {
  // If custom SVG is supplied
  if (diagram.customSvgXml) {
    return (
      <div className={`inline-block border border-blue-200 rounded-lg p-2 bg-white shadow-sm ${className}`}>
        {showTitle && <p className="text-xs font-semibold text-blue-800 mb-1">{diagram.title}</p>}
        <div dangerouslySetInnerHTML={{ __html: diagram.customSvgXml }} />
      </div>
    );
  }

  // Render based on diagram type
  const renderContent = () => {
    switch (diagram.type) {
      case 'vectors': {
        // SVG coordinate system with vectors
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 22;

        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-slate-50 rounded">
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
              <marker id="arrow-axis" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
              </marker>
            </defs>

            {/* Grid lines */}
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((step) => (
              <g key={`grid-${step}`} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2">
                <line x1={centerX + step * scale} y1={10} x2={centerX + step * scale} y2={height - 10} />
                <line x1={10} y1={centerY + step * scale} x2={width - 10} y2={centerY + step * scale} />
              </g>
            ))}

            {/* Coordinate Axes */}
            <line x1={20} y1={centerY} x2={width - 20} y2={centerY} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
            <line x1={centerX} y1={height - 20} x2={centerX} y2={20} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-axis)" />
            <text x={width - 18} y={centerY - 6} fill="#475569" fontSize="11" fontWeight="bold">X</text>
            <text x={centerX + 8} y={24} fill="#475569" fontSize="11" fontWeight="bold">Y</text>
            <text x={centerX - 10} y={centerY + 14} fill="#64748b" fontSize="10">0</text>

            {/* Custom Vectors */}
            {diagram.vectors?.map((vec, idx) => {
              const x1 = centerX + vec.start[0] * scale;
              const y1 = centerY - vec.start[1] * scale;
              const x2 = centerX + vec.end[0] * scale;
              const y2 = centerY - vec.end[1] * scale;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const color = vec.color || (idx === 0 ? '#2563eb' : idx === 1 ? '#059669' : '#dc2626');
              const markerId = color === '#059669' ? 'arrow-green' : color === '#dc2626' ? 'arrow-red' : 'arrow-blue';

              return (
                <g key={`vec-${idx}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth="2.5"
                    markerEnd={`url(#${markerId})`}
                  />
                  <text
                    x={midX + 8}
                    y={midY - 8}
                    fill={color}
                    fontSize="12"
                    fontWeight="bold"
                    filter="drop-shadow(0px 1px 1px white)"
                  >
                    {vec.label}
                  </text>
                </g>
              );
            })}

            {/* Right Angle Indicator if requested */}
            {diagram.angles?.some(a => a.isRightAngle) && (
              <path
                d={`M ${centerX + 8} ${centerY} L ${centerX + 8} ${centerY - 8} L ${centerX} ${centerY - 8}`}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.2"
              />
            )}
          </svg>
        );
      }

      case 'triangle': {
        // Triangle with mid-line or labeled vertices
        const points = diagram.vertices || [
          { label: 'A', x: 40, y: 170 },
          { label: 'B', x: 160, y: 30 },
          { label: 'C', x: 300, y: 170 },
          { label: 'M', x: 100, y: 100 },
          { label: 'N', x: 230, y: 100 },
        ];

        const getPt = (lbl: string) => points.find(p => p.label === lbl) || { x: 0, y: 0 };

        const A = getPt('A');
        const B = getPt('B');
        const C = getPt('C');
        const M = getPt('M');
        const N = getPt('N');

        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-slate-50 rounded">
            {/* Main Triangle ABC */}
            <polygon
              points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="#eff6ff"
              stroke="#2563eb"
              strokeWidth="2"
            />

            {/* Midline MN */}
            {M.x > 0 && N.x > 0 && (
              <g>
                <line
                  x1={M.x}
                  y1={M.y}
                  x2={N.x}
                  y2={N.y}
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                <circle cx={M.x} cy={M.y} r="3.5" fill="#dc2626" />
                <circle cx={N.x} cy={N.y} r="3.5" fill="#dc2626" />
                <text x={M.x - 16} y={M.y + 4} fill="#dc2626" fontSize="12" fontWeight="bold">M</text>
                <text x={N.x + 8} y={N.y + 4} fill="#dc2626" fontSize="12" fontWeight="bold">N</text>
                <text x={(M.x + N.x) / 2} y={M.y - 8} textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">
                  MN = ½ AC
                </text>
              </g>
            )}

            {/* Vertices points & labels */}
            <circle cx={A.x} cy={A.y} r="3" fill="#1e40af" />
            <circle cx={B.x} cy={B.y} r="3" fill="#1e40af" />
            <circle cx={C.x} cy={C.y} r="3" fill="#1e40af" />
            <text x={A.x - 14} y={A.y + 14} fill="#1e3a8a" fontSize="12" fontWeight="bold">A</text>
            <text x={B.x} y={B.y - 8} textAnchor="middle" fill="#1e3a8a" fontSize="12" fontWeight="bold">B</text>
            <text x={C.x + 8} y={C.y + 14} fill="#1e3a8a" fontSize="12" fontWeight="bold">C</text>

            {/* Tick marks on AM and MB to indicate midpoint */}
            {M.x > 0 && (
              <>
                <line x1={(A.x + M.x)/2 - 3} y1={(A.y + M.y)/2 - 3} x2={(A.x + M.x)/2 + 3} y2={(A.y + M.y)/2 + 3} stroke="#2563eb" strokeWidth="1.5" />
                <line x1={(B.x + M.x)/2 - 3} y1={(B.y + M.y)/2 - 3} x2={(B.x + M.x)/2 + 3} y2={(B.y + M.y)/2 + 3} stroke="#2563eb" strokeWidth="1.5" />
              </>
            )}
          </svg>
        );
      }

      default: {
        // Fallback geometric illustration
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-slate-50 rounded">
            <rect x="20" y="20" width={width - 40} height={height - 40} rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx={width/2} cy={height/2} r="50" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <line x1={width/2 - 50} y1={height/2} x2={width/2 + 50} y2={height/2} stroke="#1d4ed8" strokeWidth="1.5" />
            <text x={width/2} y={height/2 - 8} textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">R = 50</text>
          </svg>
        );
      }
    }
  };

  return (
    <div className={`geometry-diagram-card border border-blue-200/80 rounded-xl p-3 bg-white shadow-sm inline-block avoid-break ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
          <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            {diagram.title}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">SVG Сызбасы</span>
        </div>
      )}
      <div className="flex justify-center items-center">
        {renderContent()}
      </div>
      {diagram.annotations && diagram.annotations.length > 0 && (
        <div className="mt-2 text-[11px] text-slate-600 flex flex-wrap gap-2">
          {diagram.annotations.map((ann, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px]">
              {ann}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
