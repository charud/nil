function createComponent(component, props = {}, ...children) {
  if (children.length === 0) {
    children = null;
  }
  else if (children.length === 1) {
    children = children[0];
  }

  if (typeof component === 'string') {
    return { type: component, props, children };
  } else {
    return {
      type: component,
      props,
      children: component({ ...props, children })
    };
  }
}

module.exports = createComponent;
