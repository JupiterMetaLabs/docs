import React from 'react';

/**
 * CSS-only static background (no canvas animation).
 * Keeps the home hero atmosphere similar to jmdt.io.
 */
export default function JmdtHomeStaticBackground() {
  return (
    <div className="homeStaticBg" aria-hidden="true">
      <div className="homeStaticMesh homeStaticMesh--primary" />
      <div className="homeStaticMesh homeStaticMesh--accent" />
      <div className="homeStaticMesh homeStaticMesh--secondary" />
      <div className="homeStaticGrid" />
      <div className="homeStaticNoise" />
    </div>
  );
}

