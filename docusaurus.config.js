module.exports = {
    title: 'ZKJM Documentation',
    tagline: 'Official Documentation for ZKJM',
    url: 'https://docs.zkjm.io',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    // favicon: 'img/favicon.ico',
    organizationName: 'JupiterMetaZK',
    projectName: 'docs',
    trailingSlash: false,
    presets: [
      [
        '@docusaurus/preset-classic',
        {
          docs: {
            sidebarPath: require.resolve('./sidebars.js'), // Ensure this is correct
            editUrl: 'https://github.com/JupiterMetaZK/docs/edit/main/',
            // routeBasePath: '/',
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        },
      ],
    ],
  };