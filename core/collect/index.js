
import {generateI18nKey} from '../utils/index.js'

// 匹配需要翻译中文正则
const reg = /`<<(.*?)>>`/g; // 注意：这里匹配包含模板字符串

// 获取去掉模板字符串的部分 eg: '`<<中文>>`' => '中文'
function getTextNoTemplate(text) {
  return text.replace(/<<(.*?)>>/g, '$1');
}

/**
 * @function collectNeedTranslate
 * @description 收集需要翻译的key 和修改原始代码中文成国际化key
 * @param {string} src 源代码字符串
 * 
*/
export function collectNeedTranslate({ src }) {
    const needTranslate = [];
    const code = src.replace(reg,  (_, p1) => {
        const text = getTextNoTemplate(p1);
        const key = generateI18nKey(text); // 构建国际化key
        needTranslate.push({key,value: p1}) // 收集需要翻译的数据
        return "`"+ key +"`";
      });
    return { code, needTranslate }
}