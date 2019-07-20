const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * react 项目配置
 */
function resolveReactPrompts(libName) {
  // 路由
  const routerPrompt = {
    name: 'router',
    when: ({ libName }) => libName === 'react',
    type: 'list',
    message: 'Choose a kind of router:',
    choices: [
      {
        name: 'no router',
        value: 0
      },
      {
        name: 'latest react router',
        value: 'latest'
      },
      {
        name: 'specified by yourself',
        value: 'specified'
      }
    ]
  };

  // 指定路由
  const routerSpecifiedPrompt = {
    name: 'router',
    when: ({ router }) => router === 'specified',
    type: 'input',
    message: 'specified router('+ chalk.rgb(232, 197, 90)('eg: react-router@3.2.3 or react-router-dom^5.0.1') +'):'
  };

  return [
    routerPrompt,
    routerSpecifiedPrompt
  ];
}

/**
 * 项目工程设置
 * @param {Enume} lib react | vue
 * @param {Boolean} isSimpleDemo 
 */
function resolvePrompts(lib, isSimpleDemo) {

  // yarn or npm
  const pkgManagerPrompt = {
    name: 'pkgManager',
    type: 'list',
    message: 'Use npm or yarn?',
    choices: [
      {
        name: 'yarn',
        value: 'yarn'
      },
      {
        name: 'npm',
        value: 'npm'
      }
    ]
  };

  if (isSimpleDemo) return [ pkgManagerPrompt ];

  const libPrompt = {
    name: 'libName',
    type: 'list',
    message: `Please Choose a lib:`,
    choices: [
      {
        name: 'React',
        value: 'react'
      },
      {
        name: 'Vue',
        value: 'vue'
      },
      {
        name: 'web component',
        value: 'webComponent'
      }
    ]
  };

  // 单页 or 多页
  const pageTypePrompt = {
    name: 'pageType',
    message: 'Create a spa or multiple page',
    when: ({ libName = lib }) => libName === 'react',
    type: 'list',
    choices: [
      {
        name: 'single page',
        value: 'single'
      },
      {
        name: 'multiple page',
        value: 'multiple'
      }
    ]
  };

  const prompts = [
    libPrompt,
    pageTypePrompt,
    ...resolveReactPrompts(lib),
    pkgManagerPrompt
  ];

  if (lib) {
    prompts.shift();
  }

  return prompts;
}

module.exports = async function getInfo (libName, isSimpleDemo) {
  const data = await inquirer.prompt(resolvePrompts(libName, isSimpleDemo));

  data.libName = data.libName || libName || 'react';

  return data;
};