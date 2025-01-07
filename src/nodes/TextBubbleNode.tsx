import { ChangeEvent } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";

type ContentItem = {
  type: string;
  label: string;
};

type TextBubbleNodeData = {
  label: string;
  content: ContentItem[];
};

export function TextBubbleNode({ id, data }: NodeProps<TextBubbleNodeData>) {
  const { setNodes } = useReactFlow();

  const handleMainChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node;
        return {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        };
      })
    );
  };

  const handleChildInputChange = (index: number, newVal: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id) return node; // not the right node
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
  };

  return (
    <div
      className="react-flow__node-default"
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        minWidth: "150px",
      }}
    >
      <input
        type="text"
        value={data.label ?? ""}
        onChange={handleMainChange}
        placeholder="Type here..."
        style={{
          width: "100%",
          padding: "5px",
          marginBottom: "10px",
          boxSizing: "border-box",
        }}
      />

      <div>
        {data.content?.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#f0f0f0",
              margin: "5px 0",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {item.type === "textBubble" || item.type === "text" ? (
              <input
                type="text"
                value={item.label ?? ""}
                onChange={(e) => handleChildInputChange(index, e.target.value)}
                placeholder="Type here..."
                style={{
                  width: "100%",
                  padding: "5px",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              item.type
            )}
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
