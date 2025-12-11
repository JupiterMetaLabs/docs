module.exports = {
    title: 'JMDT Documentation',
    tagline: 'Scalable, Privacy-Preserving Layer 2 Blockchain',
    url: 'https://docs.zkjm.io',
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
                        { label: 'JMDT', to: 'https://zkjm.io' },
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