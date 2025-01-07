import type { Node, BuiltInNode } from "@xyflow/react";

type ContentItem = {
  type: string;
  label: string;
};

export type NodeDataWithContent = {
  label: string;
  value?: string;
  content?: ContentItem[];
};

export type PositionLoggerNode = Node<NodeDataWithContent, "position-logger">;
export type TextBubbleNode = Node<
  { label: string; content: ContentItem[] },
  "textBubble"
>;

export type AppNode =
  | BuiltInNode
  | PositionLoggerNode
  | TextBubbleNode
  | Node<NodeDataWithContent>;

export function isTextBubbleNode(node: any): node is TextBubbleNode {
  return node?.type === "textBubble";
}
