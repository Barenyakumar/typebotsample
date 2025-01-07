import React, { useMemo, useState, useEffect } from "react";

function FlowRunner({
  nodes,
  edges,
  setNodes,
}: {
  nodes: any[];
  edges: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  // path from "start" to "end"
  const path = useMemo(() => {
    const startNode = nodes.find((n) => n.type === "start");
    if (!startNode) return [];

    const pathIds = [startNode.id];
    let currentId = startNode.id;
    while (true) {
      const outEdge = edges.find((e) => e.source === currentId);
      if (!outEdge) break;
      pathIds.push(outEdge.target);
      currentId = outEdge.target;
      if (outEdge.target === "b") break; // or if node.type=== 'end'
    }

    return pathIds.map((id) => nodes.find((n) => n.id === id)).filter((x) => x);
  }, [nodes, edges]);

  
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0); // index for node we're currently displaying
  const [currentContentIndex, setCurrentContentIndex] = useState(0); // within that node, which piece of content we’re over
  const [tempValue, setTempValue] = useState(""); // save the user input in the currently active item when input-based 

  
  const currentNode = path[currentNodeIndex] || null; //node we’re on
  const contentItems = currentNode?.data?.content ?? [];  // node’s content array is extractd

  const currentItem = contentItems[currentContentIndex] || null; //content item at currentContentIndex extracting

  // to see if it is of input type
  function isInputType(type: string) {
    return type === "Email" || type === "Number" || type === "Website";
  }

  // deciding if we need to show an input or auto advnce, only when we switch nodes or content items
  useEffect(() => {
    if (!currentNode) return;

    // there's a current content item, check for input based like "Email"
    if (currentItem && isInputType(currentItem.type)) {
      // load any existing .value if there
      setTempValue(currentItem.value || "");
      return; // stopping to wait for user
    }

    // no more content items -> then check the node's own type.-> handle input-based if it is
    if (!currentItem && isInputType(currentNode.type)) {
      setTempValue(currentNode.data?.value || "");
      return; // stopping to wait for user
    }

    // if it’s a textBubble if has currentItem -> aut advance
    if (currentItem && currentItem.type === "textBubble") {
      const t = setTimeout(() => {
        // next item
        setCurrentContentIndex((i) => i + 1);
      }, 400);
      return () => clearTimeout(t);
    }

    //  no currentItem left + the node type is not input-based -> done with node => go to next node
    if (!currentItem && !isInputType(currentNode.type)) {
      const t = setTimeout(() => {
        goToNextNode();
      }, 400);
      return () => clearTimeout(t);
    }
  }, [currentItem, currentNode]);

  // call this for input if submitted for -> content item or the node's own type
  function handleSubmit() {
    if (!currentNode) return;

    // if found input type in mid-> save to the content item value field
    if (currentItem && isInputType(currentItem.type)) {
      const nodeId = currentNode.id;
      const itemIndex = currentContentIndex;
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== nodeId) return node;
          const newContent = [...(node.data?.content ?? [])];
          newContent[itemIndex] = {
            ...newContent[itemIndex],
            value: tempValue,
          };
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent,
            },
          };
        })
      );
      // moving on to next item
      setCurrentContentIndex((i) => i + 1);
      return;
    }

    // no currentItem -> check node's own type for input-based and save to node's own value field
    if (!currentItem && isInputType(currentNode.type)) {
      const nodeId = currentNode.id;
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== nodeId) return node;
          return {
            ...node,
            data: {
              ...node.data,
              value: tempValue,
            },
          };
        })
      );
      goToNextNode();
    }
  }

  // Mmving to next node
  function goToNextNode() {
    setCurrentNodeIndex((prev) => {
      const nextIndex = prev + 1;
      // reset content index
      setCurrentContentIndex(0);
      return nextIndex < path.length ? nextIndex : prev;
    });
  }

  //display all finised items for the current node + node’s type or a content item is input type & not done

  // kee[] everything that is donoe -> content items before current content indx
  const finishedItems = contentItems.slice(0, currentContentIndex);

  // checkng node type for input based, and check if it is done 
  // for done => if we've gone beyond last contnet item + byoind node's input step
  // here treating it as last item => after content array => it;s findsed only if currentContentIndex > contentItems.length
  const isNodeInputFinished =
    isInputType(currentNode?.type || "") &&
    currentContentIndex > contentItems.length;

  return (
    <div>
      {path.slice(0, currentNodeIndex).map((node, idx) => (
        <div key={node.id} style={{ marginBottom: "1rem" }}>
          {/* source node: {node.id}*/}
          <br />
          {/* show all textBubbles from content */}
          {(node.data?.content ?? [])
            .filter((c: any) => c.type === "textBubble")
            .forEach(() => {})}
          {node.data?.content?.map((item: any, i: number) => {
            if (item.type === "textBubble") {
              return <div key={i}>{item.label}</div>;
            } else if (isInputType(item.type)) {
              // Show the final typed value
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#eef",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    marginTop: "4px",
                  }}
                >
                  {item.value || "(no value)"}
                </div>
              );
            }
            return null;
          })}
          {/* if the node itself is an input type, show final typed value if presentt */}
          {isInputType(node.type) && (
            <div
              style={{
                backgroundColor: "#eef",
                padding: "4px 6px",
                borderRadius: "4px",
                marginTop: "4px",
              }}
            >
              {node.data?.value || "(no value)"}
            </div>
          )}
        </div>
      ))}
      {/* now the current node */}
      {currentNode && (
        <div style={{ marginBottom: "1rem" }}>
          {/* source node: {currentNode.id} <br /> */}

          {/* 1) show all finished content items for this node */}
          {finishedItems.map((item: any, i: number) => {
            if (item.type === "textBubble") {
              return <div key={i}>{item.label}</div>;
            } else if (isInputType(item.type)) {
              // this item is done -> showing the read-only value
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#eef",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    marginTop: "4px",
                  }}
                >
                  {item.value || "(no value)"}
                </div>
              );
            }
            return null;
          })}

          {/* 2) if we still have a current content item, check what it is:
                       - textBubble => we handle auto-advance
                       - Email => show input
                */}
          {currentItem && currentItem.type === "textBubble" && (
            <div>{currentItem.label}</div>
          )}
          {currentItem && isInputType(currentItem.type) && (
            <div style={{ marginTop: "4px" }}>
              <input
                type="text"
                placeholder={`Enter ${currentItem.type.toLowerCase()}...`}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                style={{ marginRight: "0.5rem" }}
              />
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}

          {/* 3) if no current item, but the node type is input and not finished yet,
                       show that input box. */}
          {!currentItem &&
            currentNode &&
            isInputType(currentNode.type) &&
            !isNodeInputFinished && (
              <div style={{ marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder={`Enter ${currentNode.type.toLowerCase()}...`}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                <button onClick={handleSubmit}>Submit</button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default FlowRunner;
