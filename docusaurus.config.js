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
  try {
    const files = fs.readdirSync(docsDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .sort();
    const pages = files.map(file => ({
      name: file.replace(/\.mdx?$/, ''),
      content: fs.readFileSync(path.join(docsDir, file), 'utf-8'),
    }));
    fs.writeFileSync(
      path.join(outputDir, 'docs-content.json'),
      JSON.stringify({ pages })
    );
    console.log(`[chatbot] Indexed ${pages.length} doc pages → static/docs-content.json`);
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