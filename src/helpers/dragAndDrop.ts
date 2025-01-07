import { XYPosition } from "@xyflow/react";

export function handleDragOver(event: React.DragEvent) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

export function handleDrop(
  event: React.DragEvent,
  setNodes: any,
  nodes: any[]
) {
  event.preventDefault();

  const reactFlowBounds = event.currentTarget.getBoundingClientRect();
  const position: XYPosition = {
    x: event.clientX - reactFlowBounds.left,
    y: event.clientY - reactFlowBounds.top,
  };

  //a child item being dragged from inside a node
  // const childData = event.dataTransfer.getData("application/reactflow-child");
  // if (childData) {
  //   const { parentId, childIndex, childItem } = JSON.parse(childData);

  //   const targetElement = event.target as HTMLElement;
  //   const targetId = targetElement
  //     .closest(".react-flow__node")
  //     ?.getAttribute("data-id");

  //   setNodes((curr) => {
  //     // remove the child from its old parent
  //     let updatedNodes = curr.map((node) => {
  //       if (node.id !== parentId) return node;
  //       return {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           content: node.data.content.filter(
  //             (_: any, i: number) => i !== childIndex
  //           ),
  //         },
  //       };
  //     });

  //     if (targetId) {
  //       // drop onto another node
  //       updatedNodes = updatedNodes.map((node) => {
  //         if (node.id !== targetId) return node;
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             content: [...(node.data.content || []), childItem],
  //           },
  //         };
  //       });
  //       console.log(
  //         `Component added to existing node (ID: ${targetId}):`,
  //         childItem
  //       );
  //       return updatedNodes;
  //     }

  //     // dropp on blank canvas -> bassically new node ok
  //     const newId = `child-${childItem.type}-${Date.now()}`;
  //     updatedNodes.push({
  //       id: newId,

  //       type: childItem.type === "text" ? "textBubble" : childItem.type,
  //       position,
  //       data: {
  //         label: childItem.label || childItem.type,
  //         content: [],
  //       },
  //     });
  //     console.log("New node created:", {
  //       id: newId,
  //       type: childItem.type,
  //       position,
  //       content: childItem,
  //     });
  //     return updatedNodes;
  //   });
  //   return;
  // }

  
  
  const nodeType = event.dataTransfer.getData("application/reactflow"); 
  // 2)  gettingg from the sidebar
  if (!nodeType) return;

  const targetElement = event.target as HTMLElement;
  const targetId = targetElement
    .closest(".react-flow__node")
    ?.getAttribute("data-id");

  setNodes((curr) => {
    if (targetId) {
      // dropped on an existing node
      console.log(`component added to existing node here (ID: ${targetId}):`, {
        type: nodeType,
      });
      return curr.map((node) =>
        node.id === targetId
          ? {
              ...node,
              data: {
                ...node.data,
                content: [
                  ...(node.data.content || []),
                  { type: nodeType, label: "" },
                ],
              },
            }
          : node
      );
    }
    console.log(`dropped on canvas (ID: ${nodeType}-${curr.length}):`, {
      type: nodeType,
    });
     // making new node
    return [
      ...curr,
      {
        id: `${nodeType}-${curr.length}`,
        type: nodeType,
        position,
        data: {
          label:
            nodeType === "textBubble" || nodeType === "text" ? "" : nodeType,
          content: [],
        },
      },
    ];
  });

  [setNodes];
}
