function render(component, doc) {
  if (typeof component !== 'object'
    || typeof component.type === 'undefined'
    || typeof component.props === 'undefined'
    || typeof component.children === 'undefined') {
      console.error('act.render was passed', component, 'which is not a valid component');
      throw new Error(`act.render was passed an invalid component`);
    }

  doc = doc || {
    createElement: document.createElement.bind(document),
    createTextNode: document.createTextNode.bind(document)
  };

  if (typeof component.type === 'string') {
    const elm = doc.createElement(component.type);

    // Add any props passed to this elemnt as attributes
    // This lets users pass attributes such as id and className 
    for (var key in component.props) {
      elm[key] = component.props[key];
    }

    if (typeof component.children === 'string') {
      // This component renders a text string
      elm.appendChild(doc.createTextNode(component.children));
    } else if (component.children) {
      // This component renders other components
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
