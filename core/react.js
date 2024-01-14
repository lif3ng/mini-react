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

let nextUnitOfWork;

const workLoop = (deadline) => {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
};

const createDom = (type) =>
  type === "TEXT" ? document.createTextNode("") : document.createElement(type);

const initChildren = (fiber) => {
  const children = fiber.props.children || [];
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
};

const updateProps = (dom, props) => {
  Object.keys(props || {}).forEach((k) => {
    if (k === "text") {
      dom.nodeValue = props.text;
    } else if (k !== "children") {
      dom.setAttribute?.(k, props[k]);
    }
  });
};
const performUnitOfWork = (fiber) => {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.append(dom);
    updateProps(dom, fiber.props);
  }

  initChildren(fiber);

  return fiber.child || fiber.sibling || fiber.parent?.sibling;
};
const render = (el, container) => {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };

  // let dom;
  // if (el.type === "TEXT") {
  //   dom = document.createTextNode("");
  //   dom.nodeValue = el.props.text;
  // } else {
  //   dom = document.createElement(el.type);

  //   el.props.children?.forEach((el) => {
  //     if (typeof el === "string") {
  //       el = formatTextNode(el);
  //     }
  //     render(el, dom);
  //   });
  // }

  // container.append(dom);
};

requestIdleCallback(workLoop);

const React = { createElement, render };

export default React;
