
import {currentWorkingDirectory, isFileExist, writeFileSync, createDir} from './generate/index.js'
import {normalizePath} from 'vite'
import { collectNeedTranslate } from './collect/index.js'

import {addTranslate, initDB, inserts, query} from './sqlite/index.js'
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
        const { code, needTranslate } = collectNeedTranslate({ src });
        inserts({data:needTranslate, languages: config.languages, path }) // 收集的数据插入本地数据库中
        // 生成默认语言的json文件
        generateDefaultLang({needTranslate, lang: config.languages[0]})

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
        if (result) {
          const lang = result[1];
          if (lang !== config.languages[0]) { // 默认语言不需要翻译
            // 进行翻译
            const data = query({lang});
            const temp = {}
            for (const {key, value,  isTranslated } of data) {
              if (isTranslated) {
                temp[key] = value;
                continue
              } // 翻译过就不需要再次翻译 手动翻译吧 少年
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
            writeFileSync(filePath, temp);
          }
        }
        next();
      })
    }
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