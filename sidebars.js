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
        'advantages',
      ],
    },
    {
      type: 'category',
      label: 'Core Components',
      collapsed: false,
      items: [
        'zk',
        'did',
        'tokenomics',
      ],
    },
    {
      type: 'category',
      label: 'Development & Roadmap',
      collapsed: false,
      items: [
        'roadmap',
      ],
    },
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: false,
      items: [
        'use-cases',
      ],
    },
  ],
};
