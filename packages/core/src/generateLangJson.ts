// 生成语言json文件
import path from "node:path";
import * as fs from "node:fs";


// 如果文件路径不存在 则创建文件夹
export function createDir(filePath = "") {
    try {
        // 确保路径中的所有目录都存在
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // 递归创建目录
        }
    } catch (e: any) {
        throw new Error(`创建目录时发生错误: ${e?.message}`);
    }
}
// 将内容写入json文件 先获取原来内容在添加内容 做增量写入
export function writeFileSync(filePath:string, content = {}) {
    try {
        createDir(filePath); // 如果文件夹不存在，则先创建文件夹
        const oldContent = readFileSync(filePath)
        fs.writeFileSync(filePath, JSON.stringify({...oldContent, ...content}, null, 2));  // 格式化为 JSON 字符串
    } catch (err) {
        console.error(`写入文件 ${filePath} 失败`, err);
    }
}

// 同步读取文件内容 先判断文件是否存在 存在就读取 没有则返回空对象
export function readFileSync(filePath:string) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            return {};
        }
    } catch (e:any) {
        throw new Error(`读取文件 ${filePath} 失败: ${e?.message}`)
    }
}