/**
 * Sidebar configuration for Docusaurus documentation.
 */

module.exports = {
    docs: [
      {
        type: 'category',
        label: 'Getting Started',
        collapsed: false,
        items: [
          'intro',
          'architecture',
        //   'technology-stack',
          'advantages',
        //   'data-flow',
        ],
      },
      {
        type: 'category',
        label: 'Core Components',
        collapsed: false,
        items: [
        //   'zk-rollups',
        //   'bridges',
        //   'identity',
          'tokenomics',
        ],
      },
      {
        type: 'category',
        label: 'Development & Roadmap',
        collapsed: false,
        items: [
        //   'implementation',
          'roadmap',
        ],
      },
      {
        type: 'category',
        label: 'Use Cases & Applications',
        collapsed: false,
        items: [
          'use-cases',
        ],
      },
      {
        type: 'category',
        label: 'Additional References',
        collapsed: false,
        items: [
          'references',
        ],
      },
    ],
  };