const formatTextNode = (text) => ({
  type: "TEXT",
  props: { text },
});
const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child === "string" ? formatTextNode(child) : child
    ),
  },
});
const render = (el, container) => {
  let dom;
  if (el.type === "TEXT") {
    dom = document.createTextNode("");
    dom.nodeValue = el.props.text;
  } else {
    dom = document.createElement(el.type);
    Object.keys(el.props || {}).forEach((k) => {
      if (k !== "children") {
        dom.setAttribute(k, el.props[k]);
      }
    });
    el.props.children?.forEach((el) => {
      if (typeof el === "string") {
        el = formatTextNode(el);
      }
      render(el, dom);
    });
  }

  container.append(dom);
};
const React = { createElement, render };

export default React;
