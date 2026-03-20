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
        geminiApiKey: process.env.GEMINI_API_KEY || 'DT_GEMINI_API_KEY_PLACEHOLDER',
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
            items: [
                { type: 'doc', docId: 'intro', position: 'left', label: 'Docs' },
                {
                    type: 'dropdown',
                    label: 'Networks',
                    position: 'left',
                    items: [
                        { label: 'Mainnet', to: '/docs/mainnet/overview' },
                        { label: 'Testnet', to: '/docs/testnet/overview' },
                    ],
                },
                { href: 'https://jmdt.io', label: 'jmdt.io', position: 'right' },
                { href: 'https://github.com/JupiterMetaLabs/docs', label: 'GitHub', position: 'right' },
            ],
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
                {
                    title: 'Community',
                    items: [
                        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/jmdt-blockchain' },
                        { label: 'Twitter', href: 'https://x.com/JMDT_Blockchain' },
                        { label: 'Discord', href: 'https://discord.gg/ntNU3Qed' },
                    ],
                },
            ],
            copyright: `© ${new Date().getFullYear()} JMDT. All Rights Reserved.`,
        },
        colorMode: {
            defaultMode: 'dark', // Ensuring default dark mode to match ZKJM.io
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },

        // ── SEO: Global default meta tags injected on every page ─────────────
        metadata: [
            { name: 'description', content: 'JMDT is an Ethereum Layer 2 blockchain with Zero-Knowledge Proofs, Decentralized Identity (DID), and AVC consensus for privacy, scalability, and security.' },
            { name: 'keywords', content: 'JMDT, Jupiter Meta Data Token, Ethereum Layer 2, ZK Proofs, Zero-Knowledge Proofs, Decentralized Identity, DID, L2 Blockchain, zk-rollups, AVC, smart contracts, Web3, privacy blockchain, scalable blockchain' },
            { name: 'author', content: 'JupiterMetaLabs' },
            { name: 'robots', content: 'index, follow' },
            // Open Graph defaults for all doc pages
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'JMDT Documentation' },
            { property: 'og:image', content: 'https://docs.jmdt.io/img/og-new.png' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            // Twitter Card defaults for all pages
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@JMDT' },
            { name: 'twitter:image', content: 'https://docs.jmdt.io/img/og-new.png' },
        ],
    },

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/JupiterMetaLabs/docs/edit/main/',
                    // ── AEO: Breadcrumb structured data for every doc page ─────────
                    breadcrumbs: true,
                },
                // ── SEO: Sitemap auto-generation ─────────────────────────────────
                sitemap: {
                    changefreq: 'weekly',
                    priority: 0.8,
                    ignorePatterns: ['/tags/**'],
                    filename: 'sitemap.xml',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    markdown: { mermaid: true },
};