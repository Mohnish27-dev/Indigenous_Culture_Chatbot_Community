import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import fs from "fs";
async function fetchWikiText(pageTitle) {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    let content = '';
    $('#mw-content-text .mw-parser-output > p').each((i, el) => {
        content += $(el).text() + '\n';
    });

    return content.trim();


}

const topics = [
    "Native_Americans_in_the_United_States",
    "Maya_civilization",
    "Mapuche",
    "Inca_Empire",
    "Aztecs",
    "Bhil",
    "Santal_people",
    "Nelson Mandela",
    "Mother_Teresa",

]

const main = async () => {
    for (const topic of topics) {
        const text = await fetchWikiText(topic);
        fs.writeFileSync(`data/${topic}.txt`, text, 'utf-8')
        console.log(`Saved ${topic}.txt`)
    }
}

main();

