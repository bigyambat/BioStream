import { BaseEdge, getStraightPath, EdgeProps } from '@reactflow/core';
import { useState } from 'react';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible hit area for easier selection/dragging */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: 'pointer' }}
      />
      {/* Visible edge with highlight on hover/selected */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected || isHovered ? '#2563eb' : '#3b82f6',
          strokeWidth: selected || isHovered ? 5 : 3,
          filter: selected || isHovered ? 'drop-shadow(0 0 4px #2563eb88)' : undefined,
          transition: 'stroke 0.2s, stroke-width 0.2s, filter 0.2s',
        }}
      />
    </g>
  );
} 