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
        'get-jmdt',
      ],
    },
    {
      type: 'category',
      label: 'Core Components',
      collapsed: false,
      items: [
        'zk',
        'did',
        // 'did-registry',       // DIDCreatorLite Service — coming soon
        'tokenomics',
        // 'seednode-core',      // Seed Node — coming soon
        {
          type: 'category',
          label: 'JMDT Decentralized Node',
          collapsed: true,
          items: [
            'jmdt-node',
            'running-a-node',
            // 'seednode',        // Seed Node — coming soon
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
        // 'mempool-routing-engine', // Mempool Routing Engine — coming soon
      ]
    },
    // {
    //   type: 'category',
    //   label: 'Development & Roadmap',
    //   collapsed: false,
    //   items: [
    //     'roadmap',             // Roadmap — coming soon
    //   ],
    // },
    {
      type: 'category',
      label: '🟢 Mainnet',
      collapsed: false,
      items: [
        'mainnet/overview',
        'mainnet/prerequisites',
        'mainnet/install',
        'mainnet/connect',
      ],
    },
    {
      type: 'category',
      label: '🔵 Testnet',
      collapsed: false,
      items: [
        'testnet/overview',
        'testnet/prerequisites',
        'testnet/install',
        'testnet/connect',
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