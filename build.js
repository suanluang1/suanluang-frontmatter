const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const marked = require('marked');

try {
  // Read the markdown file
  const contentPath = path.join(__dirname, 'content', 'index.md');
  const content = fs.readFileSync(contentPath, 'utf8');

  // Extract frontmatter
  const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match || !match[1]) {
    throw new Error('No frontmatter found in the markdown file');
  }
  
  const frontmatter = yaml.load(match[1]);

  // Get the markdown content (everything after frontmatter)
  let markdown = content.replace(frontmatterRegex, '').trim();
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(markdown);

  // Create HTML template
  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>${frontmatter.title || 'Suanluang Rama IX'}</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      line-height: 1.6;
    }
    .hero { 
      text-align: center; 
      padding: 100px 20px; 
      background-color: #2c3e50; 
      color: white; 
    }
    .hero h1 { 
      font-size: 2.5em; 
      margin-bottom: 10px; 
    }
    .hero p { 
      font-size: 1.2em; 
      margin-bottom: 25px; 
    }
    .button { 
      display: inline-block; 
      padding: 10px 20px; 
      background-color: #27ae60; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
    }
    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .content img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <!-- Hero Section from Frontmatter -->
  <div class="hero">
    <h1>${frontmatter.title || ''}</h1>
    <p>${frontmatter.subtitle || ''}</p>
    <a href="${frontmatter.buttonLink || '#'}" class="button">${frontmatter.buttonText || 'Explore'}</a>
  </div>
  
  <!-- Main Content Section -->
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
`;

  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Write the HTML file
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlTemplate);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
}
