module.exports = {
  types: [
    {
      value: ':pen: develop',
      name: '🖊️ develop               Develop',
    },
    {
      value: ':sparkles: new feature',
      name: '✨ new feature           Add new functionality',
    },
    {
      value: ':bug: error',
      name: '🐛 error                 Fix error',
    },
    {
      value: ':ambulance: error: critical',
      name: '🚑 error: critical       Fix critical error',
    },
    {
      value: ':rotating_light: error: codestyle',
      name: '🚨 error: codestyle      Codestyle fix',
    },
    {
      value: ':wrench: other',
      name: '🔧 other                 Other changes',
    },
    {
      value: ':fire: remove',
      name: '🔥 remove                Remove code or files',
    },
    {
      value: ':package: build',
      name: '📦 build                 Build project',
    },
    {
      value: ':rocket: optimization',
      name: '🚀 optimization          Increase preformance',
    },
    {
      value: ':recycle: refactor',
      name: '♻️  refactor              Code refactor',
    },
    {
      value: ':toolbox: config',
      name: '🧰 config                Fix or add config',
    },
    {
      value: ':tada: new version',
      name: '🎉 new version           Publich new version',
    },
  ],

  scopes: [],

  messages: {
    type: 'What changes are you making?',
    scope: '\nSelect the SCOPE you modified (optional):',
    customScope: 'Specify your AREA:',
    subject: 'Write a SHORT description:\n',
    body: 'Write a DETAIL description (optional). Use "|" for newline:\n',
    breaking: 'BREAKING CHANGES list (optional):\n',
    footer:
      'Place for meta data (tickets, links, etc.). For example: SECRETMRKT-700, SECRETMRKT-800:\n',
    confirmCommit: 'Are you satisfied with the resulting commit?',
  },

  allowCustomScopes: true,

  allowBreakingChanges: false,

  footerPrefix: 'meta data:',

  subjectLimit: 72,
};
