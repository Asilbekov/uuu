import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const IMG_DIR = '/home/z/my-project/upload/lag1_images';
const OUT_DIR = '/home/z/my-project/upload/lag1_results';

const PROMPT = `This is a test question (possibly physics or math). Extract the question and ALL answer options (A,B,C,D,E if present). Identify the correct answer if it is marked on the image. Return ONLY valid JSON: {"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A"}. If there are 5 options include E. If correct answer is unknown or not marked, set correct to null. Make sure to capture the COMPLETE question text including any formulas or equations. If the page contains no question (e.g. title page, blank page, instructions), return {"question":null,"options":{},"correct":null}.`;

const IMAGES = [
  'lag1_main-03', 'lag1_main-04', 'lag1_main-05', 'lag1_main-06',
  'lag1_main-07', 'lag1_main-08', 'lag1_main-09', 'lag1_main-10',
  'lag1_main-11', 'lag1_main-12', 'lag1_main-15', 'lag1_main-16',
  'lag1_main-17', 'lag1_main-18', 'lag1_main-19', 'lag1_main-20',
  'lag1_main-21', 'lag1_main-22'
];

// Skip if output already exists > 100 bytes
const toProcess = IMAGES.filter(name => {
  const outPath = path.join(OUT_DIR, `${name}.json`);
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    if (stats.size > 100) {
      console.log(`SKIP: ${name}.json already exists (${stats.size} bytes)`);
      return false;
    }
  }
  return true;
});

console.log(`Processing ${toProcess.length} images...`);

async function processWithRetry(zai, imageName, maxRetries = 5) {
  const imgPath = path.join(IMG_DIR, `${imageName}.jpg`);
  const outPath = path.join(OUT_DIR, `${imageName}.json`);
  
  const imageBuffer = fs.readFileSync(imgPath);
  const base64Image = imageBuffer.toString('base64');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${imageName}] Attempt ${attempt}/${maxRetries}...`);
      
      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      });
      
      const content = response.choices[0]?.message?.content;
      fs.writeFileSync(outPath, content);
      console.log(`[${imageName}] SUCCESS (${content.length} chars)`);
      return { name: imageName, success: true };
    } catch (error) {
      const is429 = error.message?.includes('429');
      console.log(`[${imageName}] Error: ${error.message?.substring(0, 100)}`);
      
      if (is429 && attempt < maxRetries) {
        const delay = Math.min(30 * Math.pow(2, attempt - 1), 300);
        console.log(`[${imageName}] Rate limited, waiting ${delay}s...`);
        await new Promise(r => setTimeout(r, delay * 1000));
      } else if (attempt >= maxRetries) {
        console.log(`[${imageName}] FAILED after ${maxRetries} retries`);
        return { name: imageName, success: false, error: error.message };
      }
    }
  }
}

async function main() {
  const zai = await ZAI.create();
  console.log('ZAI SDK initialized');
  
  const results = [];
  for (const imageName of toProcess) {
    const result = await processWithRetry(zai, imageName);
    results.push(result);
    
    // Small delay between requests to avoid rate limiting
    if (toProcess.indexOf(imageName) < toProcess.length - 1) {
      console.log('Waiting 10s before next request...');
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`\n=== RESULTS ===`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('Failed images:', results.filter(r => !r.success).map(r => r.name));
  }
}

main().catch(console.error);
