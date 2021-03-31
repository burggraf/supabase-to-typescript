const fs = require("fs");
const https = require("https");
const args = process.argv.slice(2);
let outputFile = '';
let supaUrl = '';
let supaKey = '';
if (args?.length < 3) {
    console.log('syntax: node supabase-to-typescript.js <outputFilename> <Supabase-url> <Supabase-public-api-key>');
    process.exit(0);
} else {
    outputFile =  args[0];
    supaUrl = args[1];
    if (supaUrl?.length < 8 || supaUrl.substr(0,8) !== 'https://') {
        supaUrl = 'https://' + supaUrl;
    }
    supaKey = args[2];
}

const url = `${supaUrl}/rest/v1/?apikey=${supaKey}`;

function translateFormat(type) {
    switch (type) {
        case 'text':
            return 'string';
        case 'integer':
            return 'number';
        case 'bigint':
            return 'number';
        case 'uuid':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'jsonb':
            return 'any';
        default: 
            return 'string /* UNKNOWN FORMAT */';
    }
}
function formatData(data) {
    // console.log('formatData....');
    // console.log('data.definitions');
    // console.log(data.definitions);
    let o = 'export interface Tables {\n';
    for (const table in data.definitions) {
        o += `\t${table}: {\n`;
        const defs = data.definitions[table];
        // console.log('defs.properties: ');
        // console.log(defs.properties);
        for (const field in defs.properties) {
            const format = defs.properties[field].format;
            const type = defs.properties[field].type;
            const description = defs.properties[field].description;
            const required = defs.required.indexOf(field) > -1;
            o += `\t\t${field}${required ? '' : '?'}: ${translateFormat(format)}; /* format: ${format} ${description ? 'description: ' + description.replace(/\n/g,' ') : ''}*/\n`;
        }
        o += `\t}\n`;
    }
    o += `}\n`;
    // console.log(o);
    fs.writeFileSync(outputFile, o);
};

https.get(url, response => {
    let data = '';
    response.on('data', (chunk) => {
        data += chunk;
    });
    response.on('end', () => {
        try {
            formatData(JSON.parse(data));
        } catch (err) {
            console.log('error, could not parse JSON data');
        }
    });
    response.on('error', (err) => {
        console.log('error getting file');
    });
});




