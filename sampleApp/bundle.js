const __modules = {
'../act/act.js': function() { const act = require('./createComponent');
act.render = require('./render');

return act;
 }
};
function require(path) { return __modules[path](); }
const act = require('../act/act.js');

function App() {
  return act('div', {}, 'Hello');
}

const elm = act.render(App);
document.getElementById('root').appendChild(elm);