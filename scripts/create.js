const fs = require('fs');
const { spawn }= require('child_process');
const chalk = require('chalk');
const {
  clearConsole, showVersionAndCheckUpdate, installDependences,
  startProject, initFiles, checkProjectName
} = require('../lib/utils');
const getInfo = require('../lib/get-info');


function jumpToVueCli (projectName) {
  const vueCli = spawn('vue', ['create', projectName], { stdio: 'inherit' });

  vueCli.on('error', (err) => {
    console.log('\n', chalk.bold.red('⚠️  please check vue-cli has installed,'), '  🔗 ', chalk.underline.yellow('https://cli.vuejs.org'));
    console.log('\n   ', chalk.bold.rgb(123, 45, 67)(`error info: ${err.message}`), '\n');
  });
}

/**
 * 创建一个空项目
 * 
 * @param {String} projectName 项目名称
 * @param {String} libName 目录名称
 * @param {String} isSimpleDemo 简单例子
 */
module.exports = async function create(projectName, libName, isSimpleDemo) {
  checkProjectName(projectName);

  if (libName === 'vue') return jumpToVueCli(projectName);

  clearConsole();

  // 检测更新
  await showVersionAndCheckUpdate();

  const dir = `${process.cwd()}/${projectName}`;

  if (fs.existsSync(dir)) {
    console.log(chalk.yellow(`already exists: ${dir}`));
    return;
  }

  const projectInfo = await getInfo(libName, isSimpleDemo);

  projectInfo.path = dir;
  projectInfo.isSimpleDemo = isSimpleDemo;

  // 如果是 vue 直接调 vue-cli
  if (projectInfo.libName === 'vue') return jumpToVueCli(projectInfo.projectName);

  if (projectInfo.libName === 'react') {
    initFiles(projectInfo);
    await installDependences(projectInfo);
    startProject(projectInfo);
  }
};