const act = require('../act/act.js');

function App() {
  return act('div', {}, 'Hello');
}

const elm = act.render(App);
document.getElementById('root').appendChild(elm);
