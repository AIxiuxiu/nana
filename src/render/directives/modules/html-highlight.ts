import { App } from 'vue';

export default function (app: App<Element>) {
  app.directive('html-highlight', function (el, bindings) {
    if (bindings.value.detail) {
      let innerHTML = bindings.value.detail;
      if (bindings.value.keywords) {
        const keywords = bindings.value.keywords.split(',');
        for (let i = 0; i < keywords.length; i++) {
          const keyword = keywords[i];
          if (keyword) {
            const regWord = keyword.replace(/[.[*?+^$|()/]|\]|\\/g, '\\$&');
            innerHTML = innerHTML.replace(
              new RegExp(regWord, 'g'),
              `<span class='primary' ` + (bindings.value.color ? `style='color: ${bindings.value.color}'` : ``) + `>${keyword}<\/span>`
            );
          }
        }
      }
      el.innerHTML = innerHTML;
    } else {
      el.innerHTML = '';
    }
  });
}
