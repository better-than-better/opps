const fs = require('fs');
const template = {};

const HTML = getTplContent('html/index.html');
const ENTRY_SIMPLE_DEMO = getTplContent('entry/simple.jsx');
const ENTRY_WITH_ROUTER = getTplContent('entry/with-router.jsx');
const ENTRY_WITHOUT_ROUTER = getTplContent('entry/no-router.jsx');

function getTplContent(filePath) {
  const templatesPath = `${__dirname}/../templates`;

  return fs.readFileSync(`${templatesPath}/${filePath}`);
}

function getEntryContent(needRouter) {
  return needRouter ? ENTRY_WITH_ROUTER : ENTRY_WITHOUT_ROUTER;
}

template.simpleDemo = function simpleDemo() {
  return [
    {
      root: 'src',
      entryContent: ENTRY_SIMPLE_DEMO,
      htmlTemplate: HTML
    },
    'dist',
    'webpack',
    'ssl'
  ];
};

template.singlePage = function singlePage(router) {
  const children = [
    'api',
    'assets',
    'components',
    'config',
    'helper'
  ];

  if (router) {
    children.push({
      root: 'pages',
      children: ['404', 'home']
    });
  }

  return [
    'assets',
    'dist',
    {
      root: 'src',
      entryContent: getEntryContent(router),
      htmlTemplate: HTML,
      children
    },
    'ssl',
    'webpack'
  ];
};

template.multiplePage = function multiplePage(router) {
  return [
    'assets',
    'dist',
    {
      root: 'src',
      children: [
        'api',
        'assets',
        'components',
        'config',
        'helper',
        {
          root: 'pages',
          children: [
            {
              root: 'page-1',
              entryContent: getEntryContent(router),
              htmlTemplate: HTML,
              children: ['components']
            },
            {
              root: 'page-2',
              entryContent: getEntryContent(router),
              htmlTemplate: HTML,
              children: ['components']
            }
          ]
        },
  
      ]
    },
    'ssl',
    'webpack'
  ];
};


module.exports = template;
