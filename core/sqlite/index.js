import Database from 'better-sqlite3'
import path from 'node:path'
import {createDir} from "../generate/index.js";
let db = null
export function initDB({output, dbName }) {
     try {
         createDir(`${output}db/${dbName}.db`);
         db = new Database(`${output}db/${dbName}.db`);
         // 创建基础表 如果表不存在的话 isTranslated 0 没有翻译 1 已经翻译
         db.exec(`CREATE TABLE IF NOT EXISTS languages 
     (
          ID INTEGER PRIMARY KEY   AUTOINCREMENT,
          key TEXT  NOT NULL,
          value TEXT NOT NULL,
          lang char(50) NOT NULL,
          path text NOT NULL,
          isTranslated INTEGER,
          UNIQUE(key, lang)
      );`);
     }catch (e) {
        console.error("初始化数据库失败:", e.message)
     }
}

// 插入数据

export function insert({ key, value, lang, path }) {
     try{
         if(db) {
             const stmt = db.prepare(`insert into languages (KEY,VALUE,LANG,PATH) values (?,?,?,?);`)
             return stmt.run(key, value, lang, path)?.changes === 1; // 插入成功返回true
         }
     } catch (e) {
         // console.error(`插入失败 ${key} ${value} ${lang};原因是:${e.message}`);
     }
}

// 批量插入数据
export function inserts({ data = [],languages = [], path }) {
    languages.forEach((lang,index) => {
        for (const { key, value} of data) { // 每种语言都插入数据库
           insert({ key, value: index === 0 ? value : `${value}${lang}`, lang, path}) // 只有默认语言不需要翻译
        }
    })
}


// 查询某一语言全部数据
export function query({ lang })  {
    try {
        const stmt = db.prepare(`select * from languages where lang = ?;`)
        return stmt.all(lang)
    } catch (e) {
        console.error(`查询失败 ${lang};原因是:${e.message}`)
    }
}


// 添加翻译
export function addTranslate({ key, value, lang, }) {
    try {
        const stmt = db.prepare(`update languages set value = ?, isTranslated = 1 where key = ? and lang = ?;`)
        return stmt.run(value, key, lang)?.changes === 1; // 插入成功返回true
    } catch (e) {
        console.error(`添加翻译失败 ${key} ${value} ${lang};原因是:${e.message}`)
    }
}