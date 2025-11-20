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
        'seednode-core',
        {
          type: 'category',
          label: 'JMDT Decentralized Node',
          collapsed: true,
          items: [
            'jmdt-node',
            'seednode',
            'node-selection',
            'avc',
            'bft',
            'sequencer',
            'block',
            'block-gRPC',
            'smart-contract',
            'gETH',
            'db_ops',
            'crdt',
            'did-module',
            'logging',
            'cli',
            'explorer',
          ],
        },
        'mempool-routing-engine',
      ]
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
}