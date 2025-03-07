module.exports = {
    title: 'JupiterMetaZK Documentation',
    tagline: 'Scalable, Privacy-Preserving Layer 2 Blockchain',
    url: 'https://docs.zkjm.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'JupiterMetaZK',
    projectName: 'docs',
    trailingSlash: false,

    themes: ['@docusaurus/theme-mermaid'],

    themeConfig: {
        navbar: {
            title: 'JupiterMetaZK',
            logo: {
                alt: 'ZKJM Logo',
                src: 'img/jmzk-logo.png',
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
                        { label: 'JupiterMetaZK', to: 'https://zkjm.io' },
                        { label: 'GitHub', to: 'https://github.com/JupiterMetaZK/docs' },
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
            copyright: `© ${new Date().getFullYear()} JupiterMetaZK. All Rights Reserved.`,
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
                    editUrl: 'https://github.com/JupiterMetaZK/docs/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],

    markdown: { mermaid: true },
};