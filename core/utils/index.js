
function shortenId(id) {
  // 将十六进制字符串转换为二进制 Buffer
  const buffer = Buffer.from(id, 'hex');

  // 将二进制 Buffer 转换为 Base64 字符串，并去除特殊字符（/ 和 +）
  return buffer.toString('base64').replace(/[/+=]/g, '');
}

export function generateI18nKey(text) {
    let encoded = '';
    for (let char of text) {
      encoded += char.charCodeAt(0).toString(16);
    }
    return shortenId(encoded);
  }