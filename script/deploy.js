/**
 * 发布前端测试环境脚本，查看帮助：$node deploy.js -h
 */
const projectName = require('../package.json').name;
const nginxPath = '/home/application/nginx/webroot';
const backupFile = 'qjkhd_web_backup';
const sshHost = '120.78.70.105';
const sshPort = 13222;
const sshUsername = 'root';
const sshPassword = 'Www.nana.net';
const htmlFile = 'qjkhd_web';
const maxBackupNum = 10;

let fs = require('fs');
let path = require('path');
let archiver = require('archiver');
let dayjs = require('dayjs');
let inquirer = require('inquirer');
const { NodeSSH } = require('node-ssh');
let ssh = new NodeSSH();
let { program } = require('commander');

program
  .version('0.0.1', '-v, --version', '版本')
  .description('发布脚本')
  .option('-d, --debug', 'debug调试')
  .option('-s, --skip', '跳过确认')
  .option('-n, --name [projectName]', '项目名称', projectName)
  .option('-h, --host [sshHost]', '服务器地址', sshHost)
  .option('-u, --username [sshUsername]', '服务器用户名', sshUsername)
  .option('-p, --password [sshPassword]', '服务器密码', sshPassword)
  .option('-b, --backupFile [backupFile]', '备份文件名', backupFile)
  .option('-m, --maxBackup [maxBackupNum]', '最大备份数量', checkParseInt, maxBackupNum)
  .helpOption('-h, --help', '帮助')
  .on('--help', () => {
    console.log(`\n如发布视窗:\n$node deploy.js -d -s -n ${projectName} -h ${sshHost} -u ${sshUsername} -p ${sshPassword} -b ${backupFile} -m ${maxBackupNum}`);
    process.exit(0);
  });

program.parse(process.argv);
const options = program.opts();

if (!options.debug) {
  console.debug = () => {
    //
  };
}

console.debug(options);
const rootPath = path.join(__dirname, '..');
const fileName = `${options.name}-${dayjs().format('YYYYMMDDHHmm')}.zip`;
const htmlBackupPath = `${nginxPath}/${options.backupFile}/${options.name}`;
const htmlPath = `${nginxPath}/${htmlFile}/${options.name}`;
const zipFilePath = path.join(rootPath, 'dist', fileName);
const buildFilePath = path.join(rootPath, 'dist', options.name);
const backupFilePath = `${htmlBackupPath}/${fileName}`;

async function archiveService() {
  console.debug(`>> 开始压缩${options.name}项目，压缩文件地址：${zipFilePath}`);
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip');

  archive.on('error', function (err) {
    catchError(`>> 压缩失败：${err}`);
    throw err;
  });

  archive.pipe(output);

  archive.directory(buildFilePath, false);

  archive.finalize();

  return new Promise(function (resolve, reject) {
    output.on('close', function () {
      console.debug(`>> ${fileName} 压缩完成共：${formatBytes(archive.pointer(), 2)}`);
      resolve();
    });

    output.on('error', function (err) {
      catchError(`>> ${fileName} 压缩失败${err}`);
      reject(err);
    });
  });
}

async function deploy() {
  console.log(`>> 开始发布 ${options.name}`);

  const sureQuestions = [
    {
      type: 'confirm',
      name: 'sure',
      message: '是否确定发布?',
      default: false
    }
  ];

  const { sure } = options.skip ? { sure: true } : await inquirer.prompt(sureQuestions);

  if (sure) {
    // 压缩
    await archiveService();
    const hostList = options.host.split(',');
    for (let index = 0; index < hostList.length; index++) {
      const host = hostList[index];
      await sshClient(host);
    }
    await clearZipFile();
  } else {
    process.exit(0);
  }
}

async function sshClient(host) {
  console.debug(`>> 开始ssh连接 ${options.username}@${host}:${sshPort} ${options.password}`);
  await ssh
    .connect({
      host: host,
      port: sshPort,
      username: options.username,
      password: options.password
    })
    .then(function () {
      console.debug('>> ssh连接成功');
    })
    .catch(function (reason) {
      catchError(`>> ssh连接失败: ${reason}`);
    });

  console.debug(`>> 开始上传文件:' ${zipFilePath} >>> ${backupFilePath}`);
  await ssh.putFile(zipFilePath, backupFilePath).then(
    function () {
      console.log(`>> ${fileName}上传文件完成`);
    },
    function (error) {
      catchError(`>> ${fileName}上传文件失败:' ${error}`);
      exit();
    }
  );

  console.debug(`>> 删除之前版本文件：rm -rf ${htmlPath}/*`);
  await ssh.execCommand(`rm -rf ${htmlPath}/*`, {}).then(function (result) {
    if (result.stderr) {
      catchError(`>> 删除失败：' ${result.stderr}`);
    } else {
      console.debug(`>> ${htmlPath}/* 删除成功`);
    }
  });

  console.debug(`>> 解压当前版本文件：unzip -o ${backupFilePath} -d ${htmlPath}`);
  await ssh.execCommand(`unzip -o ${backupFilePath} -d ${htmlPath}`, {}).then(function (result) {
    if (result.stderr) {
      catchError(`>> 解压失败：${result.stderr}`);
      exit();
    } else {
      console.debug('>> 解压完成：' + result.stdout);
    }
  });

  console.log(`>> ${options.name} 发布完成`);

  console.debug(`>> 查看备份数量：cd ${htmlBackupPath} && ls -l | grep "^-" | wc -l`);
  await ssh.execCommand(`cd ${htmlBackupPath} && ls -l | grep "^-" | wc -l`, {}).then(function (result) {
    if (result.stderr) {
      catchError('>> 获取备份数量失败：' + result.stderr);
      exit();
    } else {
      const num = parseInt(result.stdout, 10);
      console.debug(`>> 当前备份数量：' ${num}`);
      if (num > options.maxBackup) {
        clearBackup(num);
      } else {
        exit();
      }
    }
  });
}

async function clearZipFile() {
  console.debug(`>> 删除本地压缩文件' ${zipFilePath}`);
  return new Promise(function (resolve, reject) {
    fs.unlink(zipFilePath, function (err) {
      if (err) {
        catchError(`>> 删除本地压缩文件' ${zipFilePath} 失败：' ${err}`);
        reject();
      } else {
        console.debug(`>> 删除本地压缩文件' ${zipFilePath}成功`);
        resolve();
      }
    });
  });
}

async function clearBackup(num) {
  const clearQuestions = [
    {
      type: 'input',
      name: 'keepNum',
      message: `清理缓存,保留几份 0~${num}（默认保留最新一份）`,
      default: 1,
      validate: function (value) {
        // 校验用户输入是否合法
        if (isNaN(value) || value < 0 || value > num) {
          return `请填写0~${num}`;
        }
        return true;
      }
    }
  ];

  const { keepNum } = options.skip ? { keepNum: 1 } : await inquirer.prompt(clearQuestions);
  num = num - keepNum;

  console.debug(`清理备份文件保留${keepNum}份：cd ${htmlBackupPath} && ls -t|tail -${num}|xargs rm -rf`);
  await ssh.execCommand(`cd ${htmlBackupPath} && ls -t|tail -${num}|xargs rm -rf`, {}).then(function (result) {
    if (result.stderr) {
      catchError(`>> 清理失败: ${result.stderr}`);
    } else {
      console.debug('>> 清理备份文件完成');
    }
  });
  exit();
}

function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function checkParseInt(value, dummyPrevious) {
  try {
    return parseInt(value);
  } catch (error) {
    catchError('参数传递错误');
  }
}

function exit() {
  ssh.dispose();
  process.exit(0);
}

function catchError(error) {
  if (error) {
    console.error(error);
  }
  program.help();
  exit();
}

deploy();
