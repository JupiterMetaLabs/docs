// Load .env file into process.env (falls back gracefully if file is missing)
require('dotenv').config();

// ── Generate docs-content.json for the AI chatbot ────────────────────────────
// Runs every time Docusaurus starts or builds. Reads all .md files from /docs
// and writes them to /static/docs-content.json so the widget can fetch them.
(function generateDocsContent() {
  const fs   = require('fs');
  const path = require('path');
  const docsDir   = path.join(__dirname, 'docs');
  const outputDir = path.join(__dirname, 'static');

  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/[^\w\-]+/g, '')       
      .replace(/\-\-+/g, '-')         
      .replace(/^-+/, '')             
      .replace(/-+$/, '');            
  }

  try {
    const files = fs.readdirSync(docsDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .sort();

    const allSections = [];

    let sectionId = 0;
    files.forEach(file => {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
      const fileName = file.replace(/\.mdx?$/, '');
      
      const lines = content.split('\n');
      let mainTitle = fileName.charAt(0).toUpperCase() + fileName.slice(1);
      const fmMatch = content.match(/^title: (.*)$/m);
      if (fmMatch) mainTitle = fmMatch[1].trim();

      let currentTitle = mainTitle;
      let currentContent = [];
      let currentAnchor = '';
      
      lines.forEach(line => {
        // Match headers #, ##, ### (ignoring # for main title if it matches mainTitle)
        const match = line.match(/^(#+)\s+(.*)$/);
        if (match) {
          const depth = match[1].length;
          const title = match[2].trim();

          // If we found a new header, push previous section
          if (currentContent.length > 0 || currentTitle !== mainTitle) {
            allSections.push({
              id: sectionId++,
              name: fileName,
              parentTitle: mainTitle,
              title: currentTitle,
              content: currentContent.join('\n').trim(),
              anchor: currentAnchor
            });
          }
          currentTitle = title;
          currentAnchor = slugify(currentTitle);
          currentContent = [];
        } else {
          // Filter out frontmatter delimiters
          if (line.trim() !== '---') {
            currentContent.push(line);
          }
        }
      });
      
      if (currentContent.length > 0 || currentTitle !== mainTitle) {
        allSections.push({
          id: sectionId++,
          name: fileName,
          parentTitle: mainTitle,
          title: currentTitle,
          content: currentContent.join('\n').trim(),
          anchor: currentAnchor
        });
      }
    });

    fs.writeFileSync(
      path.join(outputDir, 'docs-content.json'),
      JSON.stringify({ pages: allSections })
    );
    console.log(`[chatbot] Indexed ${allSections.length} doc sections → static/docs-content.json`);
  } catch (e) {
    console.warn('[chatbot] Could not generate docs-content.json:', e.message);
  }
})();

module.exports = {
    title: 'JMDT Documentation',

    // ── Chatbot Widget API Key ────────────────────────────────────────────────
    // Add your Gemini API key to .env:  GEMINI_API_KEY=your_key_here
    // .env is git-ignored — never commit it.
    customFields: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
    },

    tagline: 'Scalable, Privacy-Preserving Layer 2 Blockchain',
    url: 'https://docs.jmdt.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/Frame_12.png',
    organizationName: 'JupiterMeta',
    projectName: 'docs',
    trailingSlash: false,

    themes: ['@docusaurus/theme-mermaid'],

    themeConfig: {
        navbar: {
            title: '',
            logo: {
                alt: 'JMDT Logo',
                src: 'img/jmdt_logo_dark.png',
                srcDark: 'img/jmdt_logo.png',
            },
            // items: [
            //     { type: 'doc', docId: 'intro', position: 'left', label: 'Docs' },
            //     { href: 'https://zkjm.io', label: 'ZKJM Website', position: 'right' },
            //     { href: 'https://github.com/JupiterMetaZK/docs', label: 'GitHub', position: 'right' },
            // ],
        },
        footer: {
            // style: 'dark',
            links: [
                {
                    title: 'Links',
                    items: [
                        { label: 'JMDT', to: 'https://jmdt.io' },
                        { label: 'GitHub', to: 'https://github.com/JupiterMetaLabs/docs' },
                    ],
                },
                // {
                //     title: 'Community',
                //     items: [
                //         { label: 'Twitter', href: 'https://twitter.com/zkjm' },
                //         { label: 'GitHub', href: 'https://github.com/JupiterMetaZK' },
                //     ],
                // },
            ],
            copyright: `© ${new Date().getFullYear()} JMDT. All Rights Reserved.`,
        },
        colorMode: {
            defaultMode: 'dark', // Ensuring default dark mode to match ZKJM.io
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
    },

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/JupiterMetaLabs/docs/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    markdown: { mermaid: true },
};