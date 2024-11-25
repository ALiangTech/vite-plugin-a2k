import fs from 'node:fs'
import path from 'node:path'


export const currentWorkingDirectory = process.cwd();

function writeFileSync(filePath, content = {}) {
    try {
        createDir(filePath); // 如果文件夹不存在，则先创建文件夹
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));  // 格式化为 JSON 字符串
    } catch (err) {
        console.error(`写入文件 ${filePath} 失败`, err);
    }
}

export function initJSONFile({ output }) {
   const { originDataFilePath, translateFilePath} = createFilePath(output)
   writeFileSync(originDataFilePath)
   writeFileSync(translateFilePath)
}

export function createFilePath(output = '') {
    if (!output) {
        output = '/src/locales/'
    }
     const commonFilePath = path.join(currentWorkingDirectory, output)
     const originDataFilePath =path.join(commonFilePath,  'originData.json')
     const translateFilePath = path.join(commonFilePath, 'messages.json')
     return {commonFilePath, originDataFilePath, translateFilePath}
}

export function writeMessage (data = {}, {output}) { 
    const {originDataFilePath, translateFilePath} = createFilePath(output)
    let originData = readMessages(originDataFilePath);
    originData = {...originData, ...data}
    writeFileSync(originDataFilePath, originData) // 原始数据存放起来
    let temp = {
        cn: {},
        en: {}
    }
    Object.values(originData).forEach(item => {
       temp.cn = {...temp.cn, ...item.cn}
       temp.en = {...temp.en, ...item.en}
    })
    writeFileSync(translateFilePath, temp) // 翻译文件
}

export function readMessages (path = '') {
   try {
    let data =  fs.readFileSync(path, {
        encoding: 'utf-8'
    })
    data = data ? JSON.parse(data) : {};
    return data
   } catch (error) {
     throw new Error(`${path} 文件读取失败 ${error}`)
   }
}

// 如果文件路径不存在 则创建文件夹 如果存在则不创建
export function createDir(filePath = "") {
  try {
     // 确保路径中的所有目录都存在
     const dirPath = path.dirname(filePath);
     if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // 递归创建目录
     }
  } catch (error) {
    throw new Error(`创建目录时发生错误: ${error.message}`);
  }
}