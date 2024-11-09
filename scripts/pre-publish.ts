const fs = require('fs');
const path = require('path');

const methodsPath = path.join(__dirname, '../src/methods.ts');

try {
    const content = fs.readFileSync(methodsPath, 'utf8');
    
    // Check if URLs are already correctly set
    const productionUrlCorrect = /^[^\/]private apiUrl: string = "https:\/\/www\.vexorpay\.com\/api";/m.test(content);
    const localhostUrlCorrect = /^\/\/private apiUrl: string = "http:\/\/localhost:3000\/api";/m.test(content);

    if (productionUrlCorrect && localhostUrlCorrect) {
        console.log('✅ API URLs already correctly set for production');
        process.exit(0);
    }

    // If not correct, update the URLs
    let updatedContent = content;
    updatedContent = updatedContent.replace(
        /\/\/?\s*private apiUrl: string = "https:\/\/www\.vexorpay\.com\/api";/,
        'private apiUrl: string = "https://www.vexorpay.com/api";'
    );
    updatedContent = updatedContent.replace(
        /(?<!\/\/)private apiUrl: string = "http:\/\/localhost:3000\/api";/,
        '//private apiUrl: string = "http://localhost:3000/api";'
    );

    fs.writeFileSync(methodsPath, updatedContent);
    console.log('✅ API URL updated for production');
} catch (error) {
    console.error('Error updating API URL:', error);
    process.exit(1);
} 