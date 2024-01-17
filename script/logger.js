/*---------------------------------------------------------------------------------------------
 *  日志打印
 *--------------------------------------------------------------------------------------------*/

/*
'bright'	亮色
'grey'	灰色
'italic'	斜体
'underline'	下划线
'reverse'	反向
'hidden'	隐藏
'black'	黑色
'red'	红色
'green'	绿色
'yellow'	黄色
'blue'	蓝色
'magenta'	品红
'cyan'	青色
'white'	白色
'blackBG'	背景色为黑色
'redBG'	背景色为红色
'greenBG'	背景色为绿色
'yellowBG'	背景色为黄色
'blueBG'	背景色为蓝色
'magentaBG'	背景色为品红
'cyanBG'	背景色为青色
'whiteBG'	背景色为白色
*/

const styles = {
  reset: '\x1B[0m',
  bright: '\x1B[1m',
  grey: '\x1B[2m',
  italic: '\x1B[3m',
  underline: '\x1B[4m',
  reverse: '\x1B[7m',
  hidden: '\x1B[8m',
  black: '\x1B[30m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',
  blackBG: '\x1B[40m',
  redBG: '\x1B[41m',
  greenBG: '\x1B[42m',
  yellowBG: '\x1B[43m',
  blueBG: '\x1B[44m',
  magentaBG: '\x1B[45m',
  cyanBG: '\x1B[46m',
  whiteBG: '\x1B[47m'
};

const colors = (keys, source) => {
  let values = '';
  if (typeof keys === 'string') {
    values = styles[keys];
  } else {
    keys.forEach((key) => {
      values += styles[key];
    });
  }
  return values + source + styles['reset'];
};

module.exports = {
  primary(message) {
    console.log(colors('blue', '• '), colors('blue', `${message}`));
  },

  success(message) {
    console.log(colors('blue', '• '), colors('green', `${message}`));
  },

  info(message) {
    console.log(colors('blue', '• '), colors('grey', `${message}`));
  },

  warning(message) {
    console.log(colors('magenta', '* '), colors('yellow', `${message}`));
  },

  error(message) {
    console.log(colors('magenta', '* '), colors('red', `${message}`));
  },
  showDebug: false,
  debug(message) {
    if (this.showDebug) {
      console.log(colors('grey', `${message}`));
    }
  },
  print(colorskeys, message) {
    console.log(colors(colorskeys, `${message}`));
  }
};
