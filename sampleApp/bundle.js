const __modules = {
'/act/act': function() { const act = require('/act/createComponent');
act.render = require('/act/render');

return act;
 },
'/act/createComponent': function() { function createComponent(component, props = {}, ...children) {
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

return createComponent;
 },
'/act/render': function() { function render(component, doc) {
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

return render;
 }
};
function require(path) { if(path in __modules) return __modules[path](); console.log('Pack: Module', path, 'not found'); }
const act = require('/act/act');

function App() {
  return act('div', {}, 'Hello');
}
const elm = act.render(act(App));
document.getElementById('root').appendChild(elm);