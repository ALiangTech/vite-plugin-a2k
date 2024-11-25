
import {writeMessage, currentWorkingDirectory, initJSONFile } from './generate/index.js'
import { collectNeedTranslate } from './collect/index.js'
import { translate } from  './translate/index.js'

import {initDB, inserts} from './sqlite/index.js'

const fileRegex = /\.(vue)$/

const config = {
  output: '/src/locales/', // 输出路径
  languages: ['cn','en'], // 生成的语言列表 数组第一个为系统默认语言
}

export default function myPlugin() {
  return {
    name: 'generate-i18n-key',
    buildStart() {
      initJSONFile(config); // vite开始运行时，初始化文件
      initDB();
    },
    async transform(src, id) {
      if (fileRegex.test(id)) {   
        const uid = id.replace(currentWorkingDirectory, ''); // 文件路径作为一个唯一key
        const { code, needTranslate } = collectNeedTranslate({ src });
        inserts({data:needTranslate, languages: config.languages })
        // const languagesData =  await translate(needTranslate, {...config, uid})
        // const originalData = { [uid]: languagesData }
        // writeMessage(originalData, config)
        return {
          code
        }
      }
      return {
        code: src
      }
    },
  }
}