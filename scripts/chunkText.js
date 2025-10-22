import fs from "fs";
import path from "path";

const chunkText = (text, chunkSize = 300) => {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
}


for (const file of fs.readdirSync('./data')) {
    if(file.startsWith("chunks-")||file.startsWith("embed-")){
        continue;
    }
    const filePath = path.join('./data', file);
    const text = fs.readFileSync(filePath, 'utf-8')
    const chunks = chunkText(text);
    fs.writeFileSync(
        `./data/chunks-${file}`,
        JSON.stringify(chunks, null, 2),
        'utf-8'
    );
    console.log(`Chunked ${file} into ${chunks.length} chunks`);
}