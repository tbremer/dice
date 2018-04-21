const state = Object.assign(
  Object.create(null),
  {
    sides: 6,
    numberOfDice: 1,
    rollSet: [],
  },
);

const _internalState = Object.assign(Object.create(null), state);

Object.defineProperties(
  state,
  Object.getOwnPropertyNames(state)
    .reduce(function defineProperties(all, current) {
      const property = {
        get: function get(key) {
          return _internalState[key];
        },
        set: function set(v) {
          console.log('setting v (', v, ') for property ', current);

          _internalState[current] = v;
        }
    };

    all[current] = property;

    return all;
  }, {}))

const appRoot = document.getElementById('app-root');

function app(state) {
  return buildTree(
    'main',
    null,
    buildTree(
      'h1',
      null,
      'Dice and Easy!'
    ),
    buildTree(
      'form',
      { onSubmit: handleFormSubmit, class: 'flex' },
      buildTree(
        'label',
        { 'for': 'sides' },
        'How Many Sides?'
      ),
      buildTree('br'),
      buildTree('input', { min: 1, value: 6, type: 'number', id: 'sides', name: 'sides' }),
      buildTree('br'),
      buildTree('br'),
      buildTree(
        'label',
        { 'for': 'sides' },
        'How Many Dice?'
      ),
      buildTree('br'),
      buildTree('input', { min: 1, value: 1, type: 'number', id: 'number-of-dice', name: 'number-of-dice' }),
      buildTree('br'),
      buildTree('button', null, 'submit'),
    ),
    buildTree('hr'),
    buildTree(
      'ul',
      null,
      (state.roll || []).map(function (die) {
        return buildTree('li', null, die)
      }),
    )
  );
}

render(state, app, appRoot);

function render(state, view, root) {
  while (root.firstChild) root.removeChild(root.firstChild);

  root.appendChild(buildTree(view(state)));
}

function buildTree(nodeName, attrs) {
  const props = attrs || {};
  const children = [].concat.apply([], [].slice.call(arguments, 2));
  let node;

  if (typeof nodeName === 'string') {
    node = document.createElement(nodeName);
  }
  else if (typeof nodeName === 'function') {
    node = buildTree(nodeName, props);
  }
  else if (nodeName instanceof HTMLElement) {
    node = nodeName;
  }

  children.forEach(function(child) {
    let kiddo = child;

    if (typeof kiddo === 'string') {
      kiddo = document.createTextNode(kiddo);
    }

    node.appendChild(kiddo);
  });

  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;

    const value = props[key];

    if (value === false) continue;

    if (/^on/.test(key)) {
      node.addEventListener(key.replace(/on/,'').toLowerCase(), value);
    }
    else {
      node.setAttribute(key, value === true ? key : value);
    }
  }

  return node;
}

function handleFormSubmit(evt) {
  evt.preventDefault();
  const sides  = Math.max(0, evt.target.elements.namedItem('sides').value);
  const numberOfDice  = Math.max(0, evt.target.elements.namedItem('number-of-dice').value);
  const rollSet = roll(sides, numberOfDice);

  Object.assign(state, { sides, numberOfDice, rollSet });

  console.log('die:', rollSet);
  console.log('total:', rollSet.reduce(function (all, current) {
    return all += current;
  }, 0));
}

function roll(sides, throwCount) {
  sides = sides || 6;
  throwCount = throwCount || 1;

  const arr = [];
  let c = -1;

  while ((++c) < throwCount) {
    arr.push(((Math.random() * sides) | 0) + 1);
  }

  return arr;
}
