function render(component, doc) {
  if (typeof component !== 'object'
    || typeof component.type === 'undefined'
    || typeof component.props === 'undefined'
    || typeof component.children === 'undefined') {
      throw new Error(`act.render was passed ${JSON.stringify(component)} which is not a valid component`);
    }

  doc = doc || {
    createElement: document.createElement
  };

  if (typeof component.type === 'string') {
    const elm = doc.createElement(component.type);
    if (component.children) {
      const children = ensureArray(component.children);
      for (child of children) {
        const childElm = render(child, doc);
        if (childElm) {
          elm.appendChild(childElm);
        }
      }
    }
    return elm;
  } else {
    if (component.children) {
      return render(component.children, doc);
    }
  }
};

function ensureArray(obj) {
  if (obj.length) {
    return obj;
  } else {
    return [obj];
  }
}

module.exports = render;
