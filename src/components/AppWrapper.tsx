import { ReactFlowProvider } from "@xyflow/react";
import App from "../App";

function AppWrapper() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default AppWrapper;
