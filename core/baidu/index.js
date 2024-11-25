import {MD5} from "./md5.js";

// 自动翻译
export async function autoTranslate(text, target = 'en') {
  try {
    var appid = '20241122002208900';
    var key = 'DlRrrV9Uyyz0oYa3Xp7N';
    var salt = (new Date).getTime();
    var query = text;
    var from = 'zh';
    var to = target;
    var str1 = appid + query + salt +key;
    var sign = MD5(str1);
    const params = {
        q: query,
        from: from,
        to: to,
        appid: appid,
        salt: salt,
        sign: sign
    }
    // 将参数对象转换为查询字符串
    const queryString = new URLSearchParams(params).toString();
    const baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const url = `${baseUrl}?${queryString}`;
    const data = await fetch(url).then(response => response.json())
    if(data?.trans_result) {
        return data.trans_result[0].dst
    }
    throw new Error(`无法获取翻译 ${data}`)
  } catch (error) {
    throw new Error(`翻译获取失败 ${error}`)
  }
}


/**
 * @function translateData
 * @param { Array } data 需要翻译的数据 data => [{ key, value }]
 * @param lang
 * @param isTranslated 是否已经翻译 Function(key, lang) => boolean
 */
export async function translateData(data = [],{ lang = 'en', isTranslated}) {
   let tempData = {};
   for (let index = 0; index < data.length; index++) {
    const value = data[index].value;
     // 翻译后的文本
     try {
         const translatedContent = await isTranslated(lang, data[index].key);
         if(translatedContent) {
             console.log(`${data[index].key}已经翻译过了`);
             tempData[data[index].key] = translatedContent
         } else {
             tempData[data[index].key] = await autoTranslate(value, lang)
         }
     } catch (error) {
       tempData[data[index].key] = value;
       console.error(new Error(`翻译${value}出现错误:${error.message};使用原翻译文字,请手动翻译`).message)
     }
     
   }  
   return tempData
}