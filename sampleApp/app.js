const act = require('../act/act');

function App() {
  return act('div', {},
    act(Header, {}, null),
    act('ul', {},
      act('li', {}, 'First'),
      act('li', {}, 'Second')
    )
  );
}

function Header() {
  return act('div', { style: { backgroundColor: '#333', color: '#eee' } },
    act('div', {}, "Sample app")
  );
}

const elm = act.render(act(App));
document.getElementById('root').appendChild(elm);
