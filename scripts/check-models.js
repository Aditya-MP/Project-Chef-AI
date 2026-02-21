const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_GENAI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

if (!apiKey) {
    console.error('API Key not found in .env.local');
    process.exit(1);
}

const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching models...');

https.get(listUrl, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('Error fetching list:', json.error);
                return;
            }

            const models = json.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
            console.log(`Found ${models.length} models. Testing generation...`);

            for (const model of models) {
                await testModel(model.name);
            }

        } catch (e) {
            console.error(e);
        }
    });
});

function testModel(modelName) {
    return new Promise((resolve) => {
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
        const body = JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
        });

        const req = https.request(genUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        }, (res) => {
            let resData = '';
            res.on('data', c => resData += c);
            res.on('end', () => {
                const status = res.statusCode;
                if (status === 200) {
                    console.log(`[SUCCESS] ${modelName} is WORKING.`);
                } else if (status === 429) {
                    console.log(`[FAILED] ${modelName} - Quota Exceeded (429).`);
                } else {
                    console.log(`[FAILED] ${modelName} - Error ${status}.`);
                }
                resolve();
            });
        });

        req.write(body);
        req.end();
    });
}
