import Database from 'better-sqlite3'
const db = new Database('languages.db', { verbose: console.log });

export function initDB() {
    // 创建基础表 如果表不存在的话
    db.exec(`CREATE TABLE IF NOT EXISTS languages 
     (
          ID INTEGER PRIMARY KEY   AUTOINCREMENT,
          KEY TEXT  NOT NULL,
          VALUE TEXT NOT NULL,
          LANG char(50) NOT NULL,
          UNIQUE(key, lang)
      );`);
}

// 插入数据

export function insert({ key, value, lang }) {
     try{
         const stmt = db.prepare(`insert into languages (KEY,VALUE,LANG) values (?,?,?);`)
         return stmt.run(key, value, lang)?.changes === 1; // 插入成功返回true
     } catch (e) {
         console.error(`插入失败 ${key} ${value} ${lang};原因是:${e.message}`);
     }
}

// 批量插入数据
export function inserts({ data = [],languages = [] }) {
    languages.forEach((lang,index) => {
        for (const { key, value} of data) { // 每种语言都插入数据库
           insert({ key, value: index === 0 ? value : '', lang}) // 只有默认语言不需要翻译
        }
    })
}