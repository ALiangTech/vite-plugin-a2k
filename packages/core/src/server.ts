// 给 app项目提供接口
import Koa from 'koa'
import Router from '@koa/router'
import {db, updateValue} from './sqllite'
import cors from 'koa2-cors'
import {writeFileSync} from "./generateLangJson";
import { type Config } from './index'
import bodyparser from 'koa-bodyparser'
import type {TranslateItem} from "./collect";
import { autoTranslate } from './baidu'
const app = new Koa()
app.use(cors());
// 使用bodyParser中间件
app.use(bodyparser());


const html = new Router();
html.get('/', (ctx, next) => {
    // ctx.router available
    ctx.body = 'hello world'
});


const api = new Router({
    prefix: '/api/v1'
});
// 根据不同lang 获取不同的语言列表
api.get('/langs', (ctx, next) => {
    try {
        const {lang, key} = ctx.query // 获取查询参数
        // 如果lang key 都有值 则联合查询 如果只是其中一个有值 则按照单个条件查询

        let basePrepare = `select * from languages` // 查询所有
        let langPrepare = ''
        let keyPrepare = ''
        let wherePrepare = ''
        let andPrepare = ''
        if (!(lang === 'all' || !lang)) { // 如果lang 是all 或者 undefined 可以认为是查所有 取反说明要根据lang的条件查询
            langPrepare = `lang = ?`
            wherePrepare = 'where'
        }
        if(key) { // 如果key有值 说明要根据key进行查询
            keyPrepare = `key like '%${key}%'`
            if(langPrepare) {
                andPrepare = 'and'
            } else {
                wherePrepare = 'where'
            }
        }

        basePrepare = `${basePrepare} ${wherePrepare} ${langPrepare} ${andPrepare} ${keyPrepare}`
        console.log(basePrepare)
        const smt  = db.prepare(basePrepare)
        ctx.body = (lang === 'all' || !lang) ? smt.all() : smt.all(lang)
    } catch (e:any) {
        console.error(`/lang/:lang接口出现错误: ${e?.message}`)
    }
});

// 查询系统存在咋语言类型
api.get('/langs/list', (ctx, next) => {
    try {
        let result = db.prepare(`select distinct lang from languages`).all()
        result = result.map((item:any) => ({ value: item.lang, label: item.lang}))
        result.unshift({ value: 'all', label: '所有语言' })
        ctx.body = result
    } catch (e:any) {
        console.error(`/langs/list 接口出现错误: ${e?.message}`)
    }
});

//根据lang 生成对应的json文件
api.post('/langs', (ctx, next) => {
    const { lang } = ctx.request.body as any
    console.log(ctx.request.body)
    try {
        if (!lang) {
            ctx.body = 'lang参数不能为空'
            return;
        }
        const result = db.prepare(`select * from languages where lang = ?`).all(lang)
        const filePath = `${ctx.config.output}/langs/${lang}.json`
        const temp:any = {}
        result.forEach((item) => {
            const {key,value} = item as TranslateItem;
            temp[key] = value
        });
        writeFileSync(filePath, temp)
        ctx.body = `${ctx.config.output}/langs/${lang}.json 生成成功`
    } catch (e:any) {
        console.error(`/langs post接口出现错误: ${e?.message}`)
    }
});

// 根据翻译内容 更新数据库内容

// 翻译接口 依赖百度翻译api
api.post('/translate', async (ctx, next) => {
    try {
        const { key, value , lang } = ctx.request.body as any
        if (!value || !lang || !key) {
            ctx.body = 'key,text和lang参数不能为空'
            return;
        }
       const text = await autoTranslate(value, lang)
        updateValue(key, lang, text)
        ctx.body = JSON.stringify({ text })
    } catch (e) {
        console.error(`/translate 接口出现错误: ${e}`)
    }
});


app.use(html.routes()).use(html.allowedMethods());
app.use(api.routes()).use(api.allowedMethods());

export default function (config: Config) {
    app.context.config = config;
    app.listen(3000, () => {
        console.log('监听3000端口')
    })
    return app
}



