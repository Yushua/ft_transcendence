"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("react-dom/client");
const App_1 = require("./App");
const root = client_1.default.createRoot(document.getElementById('root'));
root.render(<react_1.default.StrictMode>
    <App_1.Pong />
  </react_1.default.StrictMode>);
//# sourceMappingURL=index.js.map