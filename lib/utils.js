const fs = require('fs');
const { exec, execSync }= require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const validateProjectName = require('validate-npm-package-name');
const pkg = require('../package.json');
const template = require('../lib/template');


function _reslovePath(_path) {
  return /^\//.test(_path) ? _path : `${process.cwd()}/${_path}`;
}

/**
 * @param {String} parentPath 目录路径
 * @param dirData {Object|String} 目录说明
 */
function _createDirAndIntFile(parentPath, dirData) {
  const templatePath = `${__dirname}/../templates`;
  const dirName = typeof dirData === 'string' ? dirData : dirData.root;
  const dirPath = `${parentPath}/${dirName}`;
 
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  if (typeof dirData === 'object') {
    Object.keys(dirData).forEach(key => {
      if (key === 'root' || key === 'children') return;

      const fileNameEnum = {
        entryContent: 'index.jsx',
        htmlTemplate: 'index.html'
      };

      fs.writeFileSync(`${dirPath}/${fileNameEnum[key]}`, dirData[key].toString());
    });

    return;
  }

  if (['api', 'webpack', 'helper', 'components', '404', 'home', '/'].includes(dirName)) {
    let _dirName = dirName;
    let _dirPath = dirPath;

    if (dirName === 'components') {
      _dirName = 'component-tpl';
      _dirPath += '/hello-world';
    }

    if (dirName === 'home') {
      _dirName = 'page-tpl';
    }

    if (dirName === '/') {
      _dirName = 'root';
    }

    execSync(`cp -rf ${templatePath}/${_dirName}/ ${_dirPath}`);
  }
}

class Utils {

  /**
   * 清除置顶输出
   * 
   * @param {String} title
   * @api public
   */
  static clearConsole(title = '') {
    if (!process.stdout.isTTY) return;

    const blank = '\n'.repeat(process.stdout.rows);

    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    title && console.log(title);
  }

  /**
   * 展示当前版本并检测更新
   * 
   * @return {String}
   * @api public
   */
  static async showVersionAndCheckUpdate() {
    const newVersion = false; //'1.0.0';

    if (!newVersion) return;

    let str = chalk.bold.blue(`opps v${pkg.version}`);

    str += chalk.green(`
┌────────────────────${`─`.repeat(newVersion.length)}──┐
│  Update available: ${newVersion}  │
└────────────────────${`─`.repeat(newVersion.length)}──┘`
    );

    console.log(str);
  }

  /**
   * 安装依赖
   * @param {Object} projectInfo 
   * @api public
   */
  static async installDependences(projectInfo) {
    const spinner = ora('install dependences...').start();
    const targetPath = _reslovePath(projectInfo.path);
    const installCommand = projectInfo.pkgManager === 'yarn' ? 'yarn' : 'npm i';
  
    return new Promise((reslove, reject) => {
      exec(`cd ${targetPath} && ${installCommand}`, (err, stdout, stderr) => {
        if (err) {
          console.log('dependences not installed.');
          console.log('err:', err.message);
          reject(err);
          return;
        }
    
        spinner.succeed('dependences installed.');
        reslove(true);
      });
    });
  }

  /**
   * 启动服务
   * @param {Object} projectInfo 
   * @api public
   */
  static startProject (projectInfo) {
    const targetPath = _reslovePath(projectInfo.path);
  
    execSync(`cd ${targetPath} && npm start`, { stdio: 'inherit' });
  }

  /**
   * 生成所需文件
   * @param {Object} projectInfo 
   */
  static initFiles(projectInfo) {
    const spinner = ora('create files...').start();
    const targetPath = _reslovePath(projectInfo.path);
    const { isSimpleDemo, router, pageType } = projectInfo;

    function getDirTree() {
      if (isSimpleDemo) return template.simpleDemo();

      if (pageType === 'single') return template.singlePage(router);

      if (pageType === 'multiple') return template.multiplePage(router);

      return template.normal();
    }

    function fancy(dirs, parentPath = '') {
      dirs.forEach(v => {
        const hasChildren = typeof v === 'object' && v.children;
        const dirName = hasChildren ? v.root : v;
        const dirpath = `${parentPath}/${dirName}`;
  
        _createDirAndIntFile(parentPath, v);
        hasChildren && fancy(v.children, dirpath);
      });
    }
  
    _createDirAndIntFile(targetPath, '/');
    fancy(getDirTree(), targetPath);
    spinner.succeed('files are all ready.');
  }

  /**
   * 检测项目名称
   * @param {String} name 
   */
  static checkProjectName(name) {
    const result = validateProjectName(name)

    if (!result.validForNewPackages) {

      console.error(chalk.red(`Invalid project name: "${name}"`));

      result.errors && result.errors.forEach(err => {
        console.error(chalk.red.dim('Error: ' + err))
      });

      result.warnings && result.warnings.forEach(warn => {
        console.error(chalk.red.dim('Warning: ' + warn))
      });

      process.exit(1);
    }
  }
}

module.exports = Utils;