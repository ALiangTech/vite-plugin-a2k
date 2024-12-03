import type {Database} from 'better-sqlite3';
import DB from 'better-sqlite3'
import type {TranslateItem} from './collect';
export let db:Database
export function initDB() {
    try {
        // @ts-ignore
        db = new DB(`./node_modules/@a2k/languages.db`);
        // 创建基础表 如果表不存在的话 isTranslated 0 没有翻译 1 已经翻译
        db.exec(`CREATE TABLE IF NOT EXISTS languages 
     (
          id INTEGER PRIMARY KEY   AUTOINCREMENT,
          key TEXT  NOT NULL,
          value TEXT NOT NULL,
          lang char(50) NOT NULL,
          path text NOT NULL,
          isTranslated INTEGER,
          UNIQUE(key, lang)
      );`);
    }catch (e) {
        // @ts-ignore
        console.error("初始化数据库失败:", e.message)
    }
}

// 批量插入数据
// 将原始文本数据插入数据 这个数据是没有被翻译的只是做一层收集
interface Raw {
    key: string,
    value: string,
    lang: string,
    path: string
}
interface InsertParams {
    data: TranslateItem[]
    languages: string[]
    path: string
}
export function inserts( args:InsertParams) {
    const { data = [],languages = [], path } = args;
     try {
         const smt = db.prepare(`insert into languages (KEY,VALUE,LANG,PATH) values (?,?,?,?);`);
         languages.forEach((lang,index) => {
             for (const { key, value} of data) { // 每种语言都插入数据库
                 try {
                     smt.run(key, value, lang, path)
                 } catch (e:any) {
                     throw e
                 }
             }
         })
     }catch (e:any) {
         console.error(`插入原始数据出现错误:${e?.message}`)
     }
}

// 查询key 是否已经存在
export function queryKey(key: string, lang: string) {
    try {
        const result = db.prepare(`select * from languages where key=? and lang=?;`).all(key, lang);
        return result.length === 1 // 说明数据存在了
    } catch (e:any) {
        console.error(`查询key:${key} 失败:${e.message}`)
    }
}


// 更新单条数据的value 和 isTranslated
export function updateValue(key: string, lang: string, value: string) {
    try {
        db.prepare(`update languages set value=?,isTranslated = 1 where key=? and lang=?;`).run(value, key, lang)
        console.log(`更新key:${key} 成功`)
    } catch (e:any) {
        throw new Error(`更新key:${key} 失败:${e.message}`)
    }
}
