module.exports = {
    title: 'JupiterMetaZK Documentation',
    tagline: 'Official Documentation for JupiterMetaZK',
    url: 'https://docs.zkjm.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico', // Ensure the favicon is in /static/img/
    organizationName: 'JupiterMetaZK',
    projectName: 'docs',
    trailingSlash: false,

    themeConfig: {
        navbar: {
            title: 'JupiterMetaZK',
            logo: {
                alt: 'JupiterMetaZK Logo',
                src: 'img/jmzk-logo.png', // Ensure this matches the file in /static/img/
            },
            items: [
                { type: 'doc', docId: 'intro', position: 'left', label: 'Docs' },
                { href: 'https://github.com/JupiterMetaZK/docs', label: 'GitHub', position: 'right' },
            ],
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
};