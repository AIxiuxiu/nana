#!/usr/bin/env node

/*---------------------------------------------------------------------------------------------
 *  install 之后安装 electron依赖
 *--------------------------------------------------------------------------------------------*/

const { yarnRun } = require('../utils');
const global = require('../global');
const fs = require('fs-extra');

/**
 * 修改nsis 为utf8-已经不需要了
 */
const winPostinstall = function () {
  if (process.platform === 'win32') {
    fs.readFile(global.nsisPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace('args.push("-");', 'args.push("-INPUTCHARSET", "UTF8", "-");');
      fs.outputFile(global.nsisPath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
};

// 安装electron依赖
yarnRun(['electron:dep']);

// 修改electron-builder源码
// winPostinstall();
