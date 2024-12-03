

// 匹配需要翻译中文正则
import {generateI18nKey} from "./generateI18nKey";
import {queryKey} from "./sqllite";

const reg = /`\[\[(.*?)]]`/g; // 注意：这里匹配包含模板字符串

// 获取去掉模板字符串的部分 eg: '`[[中文]]`' => '`中文`'
function getTextNoTemplate(text: string) {
    return text.replace(/\[\[(.*?)]]/g, '$1');
}

// @ts-ignore
/**
 * @function collectNeedTranslate
 * @description 收集需要翻译的key 和修改原始代码中文成国际化key
 * @param {string} src 源代码字符串
 * @param lang
 */
export function collectNeedTranslate({ src, lang } :any) {
    const needTranslate: TranslateItem[] = [];
    const code = src.replace(reg,  (_: any, value: string) => {
        const text = getTextNoTemplate(value);
        const key = generateI18nKey(text); // 构建国际化key
        // 判断key 是否已经被收集，如果被收集了 就不要在翻译数据中
        if(!queryKey(key, lang)) {
            needTranslate.push({key,value }) // 收集需要翻译的数据
        }
        return "`"+ key +"`"; // 将中文替换成国际化key
    });
    return { code, needTranslate }
}


export interface TranslateItem {
    key: string;
    value: string;
}










