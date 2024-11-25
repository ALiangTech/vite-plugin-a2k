// 翻译
import {translateData } from '../baidu/index'
import {createFilePath, readMessages} from "../generate/index.js";



export async function translate(data = [],  {languages = ['en'], defaultLang, uid, output }) {
    const temp = {};
    const isTranslated = checkTranslated.bind(null,{ uid, output });
	for (let index = 0; index < languages.length; index++) {
        const lang = languages[index];
        temp[lang] = await translateData(data, {lang, isTranslated })
    }
    // 将默认语言也构建一下
    const defaultLangData = {};
   data.map(({ key, value}) => {
       defaultLangData[key] = value;
    });
    temp[defaultLang] = defaultLangData
    return temp;
}


// 判断某个key是否存在，并且已经翻译过了 就不要重复翻译了
export function checkTranslated({ uid='', output = ''}, lang='', key='') {
  try {
      // 先从originData中获取 翻译过的数据
      const {originDataFilePath} = createFilePath(output);
      const originData = readMessages(originDataFilePath);
      const currentFileTranslateData = originData[uid]
      const currentLangData = currentFileTranslateData?.[lang]; // 获取当前语言的翻译数据
      return currentLangData?.[key]
  }catch (e) {
      throw new Error(`判断${key},是否翻译。出现错误:${e.message}`)
  }
}