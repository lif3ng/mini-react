import React from "./react";
const createRoot = (container) => ({
  render(app) {
    React.render(app, container);
  },
});

export default { createRoot };
