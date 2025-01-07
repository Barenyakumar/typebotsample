import React, { useCallback } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";

import { type PositionLoggerNode } from "./types";

export function PositionLoggerNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const x = `${Math.round(positionAbsoluteX ?? 0)}px`;
  const y = `${Math.round(positionAbsoluteY ?? 0)}px`;

  const { setNodes } = useReactFlow();

  const handleChildInputChange = useCallback(
    (index: number, newVal: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id !== id) return node;
          return {
            ...node,
            data: {
              ...node.data,
              content: node.data.content.map((item, i) =>
                i === index ? { ...item, label: newVal } : item
              ),
            },
          };
        })
      );
    },
    [id, setNodes]
  );

  //  dragging a child out of this node -> i have to update this
  const handleDragStart = useCallback(
    (event: React.DragEvent, index: number) => {
      const childItem = data.content[index];
      event.dataTransfer.setData(
        "application/reactflow-child",
        JSON.stringify({
          parentId: id,
          childIndex: index,
          childItem,
        })
      );
      event.dataTransfer.effectAllowed = "move";
    },
    [id, data.content]
  );

  // Stop node-drag if user clicks in child region
  const handleMouseDownChild = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="react-flow__node-default" style={{ padding: 10 }}>
      {/* Node Label */}
      <Handle type="target" position={Position.Top} />
      {data.label && <div>{data.label}</div>}

      {/* <div>{x} {y}</div> */}

      {/* Child items */}
      <div style={{ marginTop: 8 }}>
        {data.content?.map((item, index) => {
          const isTextInput =
            item.type === "text" || item.type === "textBubble";
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onMouseDown={handleMouseDownChild}
              data-nodrag
              style={{
                background: "#eef",
                margin: "5px 0",
                padding: "5px",
                borderRadius: "5px",
                cursor: "grab",
              }}
            >
              {isTextInput ? (
                <input
                  type="text"
                  value={item.label ?? ""}
                  onChange={(e) =>
                    handleChildInputChange(index, e.target.value)
                  }
                  placeholder="Type here..."
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              ) : (
                item.label || item.type
              )}
            </div>
          );
        })}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
