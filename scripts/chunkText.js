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


async function processFiles() {
    const files = await fs.promises.readdir('./data');
    for (const file of files) {
        if (file.startsWith("chunks-") || file.startsWith("embed-")) {
            continue;
        }
        const filePath = path.join('./data', file);
        const text = await fs.promises.readFile(filePath, 'utf-8');
        const chunks = chunkText(text);
        await fs.promises.writeFile(
            `./data/chunks-${file}`,
            JSON.stringify(chunks, null, 2),
            'utf-8'
        );
        console.log(`Chunked ${file} into ${chunks.length} chunks`);
    }
}

processFiles();
