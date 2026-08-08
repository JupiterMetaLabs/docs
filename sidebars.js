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
        'transaction-lifecycle',
        'did',
        'tokenomics',
        {
          type: 'category',
          label: 'JMDT Decentralized Node',
          collapsed: true,
          items: [
            'jmdt-node',
            'running-a-node',
            'docker',
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
      ]
    },
    {
      type: 'category',
      label: 'Development & Roadmap',
      collapsed: false,
      items: [
        'roadmap',
        'migration-v1-to-v2',
        'changelog',
      ],
    },
    {
      type: 'category',
      label: 'Mainnet',
      collapsed: false,
      items: [
        'mainnet/mainnet-overview',
        'mainnet/mainnet-prerequisites',
        'mainnet/mainnet-install',
        'mainnet/mainnet-connect',
      ],
    },
    {
      type: 'category',
      label: 'Testnet',
      collapsed: false,
      items: [
        'testnet/testnet-overview',
        'testnet/testnet-prerequisites',
        'testnet/testnet-install',
        'testnet/testnet-connect',
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