import {MD5} from "./md5";

// 自动翻译
export async function autoTranslate(text:string, target = 'en') {
  try {
      const appid = '20241122002208900';
      const key = 'DlRrrV9Uyyz0oYa3Xp7N';
      const salt = (new Date).getTime();
      const query = text;
      const from = 'zh';
      const to = target;
      const str1 = appid + query + salt + key;
      const sign = MD5(str1);
      const params = {
        q: query,
        from: from,
        to: to,
        appid: appid,
        salt: salt,
        sign: sign
    }
    // 将参数对象转换为查询字符串
    const queryString = new URLSearchParams(params as any).toString();
    const baseUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const url = `${baseUrl}?${queryString}`;
    const data = await fetch(url).then(response => response.json())
    if(data?.trans_result) {
        return data.trans_result[0].dst
    }
  } catch (error) {
    throw new Error(`翻译文本--${text}--获取失败 ${error}`)
  }
}

