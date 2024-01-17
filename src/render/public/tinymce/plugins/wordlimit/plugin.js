(function () {
  'use strict';

  let Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');
  let global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  let defaults = {
    // max: 0, // 最多可以输入多少字
    spaces: false, // 是否含空格
    isInput: false, // 是否在超出后还可以输入
    wordlimitCallback: null // 自定义的提示方法, 默认用编辑器自带
  };

  class WordLimit {
    constructor(editor, options) {
      this.editor = editor;
      this.options = Tools.extend(defaults, options);

      var _this = this,
        oldContent = editor.getContent(),
        WordCount = editor.plugins.wordcount,
        preCount = 0,
        _wordCount = 0;

      editor.on('input paste undo redo Keyup ', function (e) {
        var content = editor.getContent() || e.content || '';
        if (_this.options.spaces) {
          // 字数
          _wordCount = WordCount.body.getCharacterCount();
        } else {
          // 不含空格字数
          _wordCount = WordCount.body.getCharacterCountWithoutSpaces();
        }

        if (_wordCount > _this.options.max) {
          preCount = _wordCount;
          // 禁止再输入
          if (!_this.options.isInput) {
            // 内容超出还原
            editor.setContent(oldContent);

            // 还原后重新统计
            if (_this.options.spaces) {
              _wordCount = WordCount.body.getCharacterCount();
            } else {
              _wordCount = WordCount.body.getCharacterCountWithoutSpaces();
            }
          }

          editor.getBody().blur();

          _this.options.wordlimitCallback({
            maxCount: _this.options.max,
            wordCount: _wordCount,
            preCount: preCount,
            isPaste: e.type === 'paste' || e.paste || false,
            oldContent
          });
        }

        oldContent = editor.getContent();
      });
    }
  }

  function Plugin() {
    global.add('wordlimit', function (editor) {
      var options = editor.getParam('wordlimit', {}, 'object');

      if (!options || !options.max) {
        return false;
      }

      if (typeof options.wordlimitCallback !== 'function') {
        options.wordlimitCallback = function (e) {
          // e.maxCount   // 配置的最大输入字数
          // e.wordCount  // 已输入的字数
          // e.preCount    // 粘贴进来的内容字数，可以用来单独提示粘贴内容时超出的计算
          // e.isPaste       // 是否是粘贴输入
          var beyond = 0;
          if (e.wordCount > e.maxCount) {
            beyond = e.wordCount - e.maxCount;
          }
          editor.notificationManager.open({
            text: '最多只能输入' + e.maxCount + '个字' + (beyond > 0 ? '，已超出' + beyond + '个字，超出部分无法保存' : '。'),
            type: 'error',
            timeout: 3000
          });
        };
      }

      if (!editor.plugins.wordcount) {
        editor.notificationManager.open({
          text: '请先在tinymce的plugins配置wordlimit之前加入wordcount插件',
          type: 'error',
          timeout: 3000
        });
        return false;
      }

      editor.on('init', function (e) {
        new WordLimit(editor, options);
      });
    });
  }

  Plugin();
})();
