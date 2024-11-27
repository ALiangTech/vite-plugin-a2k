
import {currentWorkingDirectory, isFileExist, writeFileSync, createDir} from './generate/index.js'
import {normalizePath} from 'vite'
import { collectNeedTranslate } from './collect/index.js'

import {addTranslate, initDB, inserts, query, queryKey} from './sqlite/index.js'
import {autoTranslate} from "./baidu/index.js";
import {tryStatement} from "@babel/types";

const fileRegex = /\.(vue)$/

const config = {
  output: '/src/locales/', // 输出路径
  languages: ['cn','en'], // 生成的语言列表 数组第一个为系统默认语言 至少有一个语言
  dbName: 'languages' // 数据库文件名称
}

export default function myPlugin() {
  return {
    name: 'generate-i18n-key',
    buildStart() {
      config.output = `${currentWorkingDirectory}${config.output}`
      generateLanguagesJson(config)
      initDB(config);
    },
    transform(src, id) {
      if (fileRegex.test(id)) {
        const path = id.replace(normalizePath(currentWorkingDirectory), ''); // 文件路径作为一个唯一keys
        let { code, needTranslate } = collectNeedTranslate({ src });
        needTranslate = findNeedTranslateData({ needTranslate, path });
        // 是否需要插入db的数据
        if (needTranslate.length) {
          inserts({data:needTranslate, languages: config.languages, path }) // 收集的数据插入本地数据库中
          // 生成默认语言的json文件
          generateDefaultLang({needTranslate, lang: config.languages[0]})
        }
        return {
          code
        }
      }
      return {
        code: src
      }
    },
    configureServer(server) {
      server.middlewares.use(async(req, res, next) => {
        // 自定义请求处理...
        // 如果请求的是json 文件那我这个时候 去给他生成json 文件
        const result = req.url.match(/\/langs\/(.*?)\.json/);
        if (result && false) { // 先放弃自动化翻译和json文件生成
          const lang = result[1];
          if (lang !== config.languages[0]) { // 默认语言不需要翻译
            // 进行翻译
            const data = query({lang});
            const temp = {}
            for (const {key, value,  isTranslated } of data) {
              if (isTranslated) {
                continue // 翻译过不需要在翻译直接跳过
              }
               try {
                 const translatedContent = await autoTranslate(value, lang);
                 temp[key] = translatedContent;
                 addTranslate({key, value: translatedContent, lang })
               } catch (e) {
                 console.log(`翻译出现问题${e.message}`)
               }
            }
            // 翻译结束 生成对应语言的json文件
            const filePath = `${config.output}/langs/${lang}.json`
            if(Object.values(temp).length) { // 都翻译过 就不要在重复生成json文件
              writeFileSync(filePath, temp);
            }
          }
        }
        next();
      })
    },
  }
}

/**
 *  根据languages 配置生成初始化的json文件
 * */
export function generateLanguagesJson({ languages }) {
  languages.forEach(lang => {
    const filePath = `${config.output}/langs/${lang}.json`
    if (!isFileExist(filePath)) { // 文件不存在则创建
      createDir(filePath)
      const temp = {}
      writeFileSync(filePath, temp)
    }
  })
}



/**
 * 根据languages 配置生成系统默认语言的json文件
 *
 * **/
export function generateDefaultLang({ lang = 'cn'}) {
  const filePath = `${config.output}/langs/${lang}.json`
  const data = query({lang});
  const temp = {}
  data.forEach(( { key, value }) => {
    temp[key] = value;
  });
  writeFileSync(filePath, temp)
}


/**
 * 找出当前文件中 未被存放在sqlite 中的数据  可以认为没有存放在db中的数据 就没有被翻译
 *
 * */
export function findNeedTranslateData({ needTranslate, path }) {
  const findKey = queryKey({path, lang: config.languages[0]});
  const temp = [];
  needTranslate.forEach(({ key, value }) => {
    const isExist = findKey(key)
    if (!isExist) {
      temp.push({ key, value })
    }
  })
  return temp;
}