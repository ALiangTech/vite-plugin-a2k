import {type Plugin, normalizePath } from 'vite'
import {collectNeedTranslate, type TranslateItem} from "./collect";
import {exportAll, initDB, inserts} from "./sqllite";
import {writeFileSync} from "./generateLangJson";
import startApp from './server'



export default function a2k(options: OptionalConfig = {}): Plugin {
    const fileRegex = /\.(vue|js|mjs|jsx|ts|mts|tsx)$/;
    const currentWorkingDirectory = process.cwd();
    const config:Config = Object.assign({
        "output": '/src/locales',
        backup: '',
        "languages": ['cn', 'en'], // 数组第一个就是默认系统默认语言
    }, options);
    return {
        name: 'a2k',
        buildStart(){
            config.output = `${currentWorkingDirectory}${config.output}`
            config.backup = `${config.output}/langs/backup.json`; // 备份json存放地址
            initDB(config)
            startApp(config);
        },
        transform(src, id) {
            if (fileRegex.test(id)) {
                // 只操作符合条件的文件
                const path = id.replace(normalizePath(currentWorkingDirectory), ''); // 文件路径作为一个标识符
                const { code, needTranslate } = collectNeedTranslate({ src, lang: config.languages[0] });
                if(needTranslate.length) {
                    inserts({data:needTranslate, languages: config.languages, path }) // 收集的数据插入本地数据库中
                    // 生成默认的语言json文件
                    exportAll(config.backup)
                    generateDefaultLang(config, needTranslate)
                }
                return  {
                    code,
                }
            }
            return {
                code: src,
            }
        },
        watchChange(id, change) {
            // 监听db的变化生成语言文件
        },
    }
}

export interface Config {
    output: string
    backup: string
    languages: string[]
}

type OptionalConfig = {
    [K in keyof Config]?: Config[K]
}

/**
 * 根据languages 配置生成系统默认语言的json文件
 *
 * **/
export function generateDefaultLang(config: Config, data: TranslateItem[]) {
    const defaultLang = config.languages[0];
    const filePath = `${config.output}/langs/${defaultLang}.json`
    const temp:any = {}
    data.forEach((item : TranslateItem) => {
        const {key,value} = item;
        temp[key] = value
    });
    writeFileSync(filePath, temp)
}
