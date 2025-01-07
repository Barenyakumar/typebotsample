import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import Sidebar from "./components/Sidebar";
import "./styles.css";
import FlowRunner from "./components/FlowRunner";
import { handleDragOver, handleDrop } from "./helpers/dragAndDrop";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const onPrintAllNodesAndEdges = () => {
    const allNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      label: node.data?.label,
      content: node.data?.content || [],
    }));
    const allEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));
    console.log("Nodes:", allNodes);
    console.log("Edges:", allEdges);
    
    setIsTestOpen(true);
  };

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onPrintAllNodesAndEdges={onPrintAllNodesAndEdges} />
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, setNodes, nodes)}
          fitView
          // dragCancel="[data-nodrag]"
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      {isTestOpen && (
        <div
          style={{
            width: "300px",
            borderLeft: "1px solid #ccc",
            padding: 10,
            background: "#fff",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setIsTestOpen(false)}
            style={{ marginBottom: "1rem" }}
          >
            Close
          </button>
          <FlowRunner nodes={nodes} edges={edges} setNodes={setNodes} />
        </div>
      )}
    </div>
  );
}

export default App;
