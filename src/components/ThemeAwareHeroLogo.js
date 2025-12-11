import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function ThemeAwareHeroLogo({ style }) {
    const { colorMode } = useColorMode();

    return (
        <img
            src={colorMode === 'dark' ? 'img/jmdt_logo.png' : 'img/jmdt_logo_dark.png'}
            alt="JMDT Logo"
            style={style}
        />
    );
}
