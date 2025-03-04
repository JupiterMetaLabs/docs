import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();
  useEffect(() => {
    history.push('/docs/intro'); // Redirect to intro.md
  }, []);
  return null; // No visible homepage, just redirect
}