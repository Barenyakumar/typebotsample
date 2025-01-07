import type { NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { TextBubbleNode } from "./TextBubbleNode";
import { AppNode } from "./types";

export const initialNodes: AppNode[] = [
  {
    id: "a",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start", content: [] },
  },
  {
    id: "b",
    type: "end",
    position: { x: -100, y: 100 },
    data: { label: "End", content: [] },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  textBubble: TextBubbleNode,
  start: PositionLoggerNode,
  end: PositionLoggerNode,
  output: PositionLoggerNode,
  Email: PositionLoggerNode,
  Website: PositionLoggerNode,
  Number: PositionLoggerNode,
} satisfies NodeTypes;
