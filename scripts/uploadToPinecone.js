
import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PINECONE_API_KEY=process.env.PINECONE_API_KEY;

const pc = new Pinecone({
    apiKey: PINECONE_API_KEY
});


const indexName='indigenous-cultures' //this is the index where we want to save our data

const main=async()=>{
    const embedFiles=fs.readdirSync(`./data`).filter(f=>f.startsWith("embed-"))
    for(const file of embedFiles){
        const embeddings=JSON.parse(fs.readFileSync(path.join(`./data`,file),'utf-8'));
        const vectors=embeddings.map((item,i)=>({
            id:`${file}-${i}`,
            values:item.embedding,
            metadata:{
                text:item.chunk,
                source:item.metadata.source,
                chunkIndex:item.metadata.chunkIndex

            }
        }));

        //Upsert the above created vectors into pinecone in batches.
        for(let i=0;i<vectors.length;i+=10){
            await pc.index(indexName).upsert(vectors.slice(i,i+10));
            console.log(`Upserted Batch ${i+1} to ${i+10} for ${file}`);
        }
    }
}

main();