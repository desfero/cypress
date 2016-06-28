import _ from 'lodash'

function command ({ name, message, number = 0, event = false, type = 'parent', state = 'passed', referencesAlias = null, numElements = null, alias = null, visible = true, aliasType = null }) {
  return {
    id: _.uniqueId('c'),
    name,
    message,
    number,
    event,
    type,
    indent: 0,
    state,
    referencesAlias,
    aliasType: aliasType || (referencesAlias || alias ? 'dom' : null),
    alias,
    numElements,
    visible,
  }
}

function hook ({ name, failed = false, commands = [] }) {
  return {
    id: _.uniqueId('h'),
    name,
    failed,
    commands,
  }
}

const levelCommands = [
  [
    command({ name: 'viewport', message: '500, 500', number: 1 }),
    command({ name: 'visit', message: '/test.html', number: 2 }),
    command({ name: 'xhr', message: 'o GET 500 /users', event: true, alias: 'getUsers', aliasType: 'route' }),
  ],
  [
    command({ name: 'get', message: 'input', number: 3, alias: 'input' }),
    command({ name: 'get', message: 'button', number: 4, alias: 'button' }),
  ],
  [
    command({ name: 'viewport', message: '700, 400', number: 3 }),
    command({ name: 'wait', message: '10000', number: 4, state: 'pending', type: 'child' }),
  ],
]

function beforeHook (...levels) {
  return {
    name: 'before each',
    commands: _.flatMap(levels, (level) => levelCommands[level]),
  }
}

const assertTrue = hook({
  name: 'test',
  commands: [
    command({ name: 'assert', message: 'expected: **true** to be true', number: 1 }),
  ],
})

const getTest = hook({
  name: 'test',
  commands: [
    command({ name: 'get', message: '@input', number: 1, referencesAlias: 'input', numElements: 1 }),
    command({ name: 'get', message: '@button', number: 2, referencesAlias: 'button', numElements: 1 }),
    command({ name: 'get', message: 'p', number: 3, numElements: 3 }),
    command({ name: 'first', message: '', number: 3, numElements: 1, type: 'child' }),
    command({ name: 'get', message: 'h5', number: 4, numElements: 0, state: 'failed' }),
  ],
})

const emptyTestHook = hook({
  name: 'test',
})

const agents = [
  { id: 'ab', type: 'spy-1', functionName: 'someMethod', callCount: 1 },
  { id: 'cd', type: 'spy-2', functionName: 'someOtherMethod', callCount: 0 },
]

const routes = [
  { id: 'ab', method: 'GET', url: '/users$/', isStubbed: true, alias: 'getUsers', numResponses: 1 },
  { id: 'cd', method: 'GET', url: '/orgs$/', isStubbed: false, alias: 'getOrgs', numResponses: 0 },
]

function runnable (type, { title, indent, hooks, children, state = 'passed', error = null, agents = [], routes = [] }) {
  return {
    type,
    id: _.uniqueId('r'),
    title,
    indent,
    hooks,
    children,
    state,
    error,
    agents,
    routes,
  }
}

function test (props) {
  return runnable('test', props)
}

function suite (props) {
  return runnable('suite', props)
}

const tests = {
  spec: ' / Users / chrisbreiding / Dev / cypress / _playground2 / cypress / integration / foo_spec.coffee',
  tests: [
    test({ title: 'has no commands', indent: 5, hooks: [emptyTestHook], routes }),
    test({ title: 'test at top level', indent: 5, hooks: [assertTrue], routes }),
    suite({ title: 'top level', indent: 5, state: 'processing', children: [
      suite({ title: 'second level (1) with a nice long title that will overflow overflow overflow overflow overflow', indent: 20, state: 'failed', children: [
        test({ title: 'test in second level (1) with a nice long title that will overflow overflow overflow overflow overflow', indent: 35, hooks: [beforeHook(0), assertTrue] }),
        test({ title: 'test in second level (2)', indent: 35, hooks: [beforeHook(0), assertTrue] }),
        suite({ title: 'third level (1) - in second level (1)', indent: 35, state: 'failed', children: [
          test({ title: 'test in third level (1) with a nice long title that will overflow overflow overflow overflow overflow', indent: 50, state: 'failed', error: `CypressError: Timed out retrying: Expected to find element: 'h5', but never found it.`, hooks: [beforeHook(0, 1), getTest], agents }),
        ] }),
      ] }),
      suite({ title: 'second level (2)', indent: 20, state: 'processing', children: [
        suite({ title: 'third level (2) - in second level (2)', indent: 35, state: 'processing', children: [
          test({ title: 'test in third level (2)', indent: 50, state: 'active', hooks: [beforeHook(0, 2), assertTrue] }),
        ] }),
      ] }),
    ] }),
  ],
}

export default {
  tests,
}
