const fs = require('fs');
const path = require('path');

// Get all MDX files in services directory
const servicesDir = './content/services';
const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace smart quotes with straight quotes
  content = content.replace(/"/g, '"');  // Left double quote
  content = content.replace(/"/g, '"');  // Right double quote
  content = content.replace(/'/g, "'");  // Left single quote
  content = content.replace(/'/g, "'");  // Right single quote

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('All smart quotes replaced with straight quotes!');