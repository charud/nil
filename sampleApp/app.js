const act = require('../act/act');

function App() {
  return act('div', {}, 'Hello');
}
const elm = act.render(act(App));
document.getElementById('root').appendChild(elm);
