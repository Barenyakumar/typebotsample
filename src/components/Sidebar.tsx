import React from "react";

const Sidebar = ({
  onPrintAllNodesAndEdges,
}: {
  onPrintAllNodesAndEdges: () => void;
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      style={{
        width: "200px",
        background: "#f0f0f0",
        padding: "10px",
        borderRight: "1px solid #ccc",
      }}
    >
      <h4>Drag Bubbles</h4>
      <div
        onDragStart={(e) => onDragStart(e, "textBubble")}
        draggable
        style={{
          margin: "10px",
          padding: "10px",
          background: "#ddd",
          cursor: "grab",
        }}
      >
        Text
      </div>
      <h4>Drag Components</h4>
      <div
        onDragStart={(e) => onDragStart(e, "Email")}
        draggable
        style={{
          margin: "10px",
          padding: "10px",
          background: "#ddd",
          cursor: "grab",
        }}
      >
        Email Input
      </div>
      <div
        onDragStart={(e) => onDragStart(e, "Number")}
        draggable
        style={{
          margin: "10px",
          padding: "10px",
          background: "#ddd",
          cursor: "grab",
        }}
      >
        Number Input
      </div>
      <div
        onDragStart={(e) => onDragStart(e, "Website")}
        draggable
        style={{
          margin: "10px",
          padding: "10px",
          background: "#ddd",
          cursor: "grab",
        }}
      >
        Website Input
      </div>
      <button
        onClick={onPrintAllNodesAndEdges}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Test
      </button>
    </div>
  );
};

export default Sidebar;
