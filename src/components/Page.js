import { css, createGlobalStyle, ThemeProvider } from 'styled-components';

import Meta from './Meta';

// Converts to system spacing using the system unit
// function systemUnitConverter(num) {
//     const strippedSystemUnit = theme.system.systemUnit.replace(/\D/g, '');
//     return String(num * Number(strippedSystemUnit)) + 'px';
// }

const theme = {
    color: {
        // Neutral Palette
        black: '#000',
        grey950: '#111',
        grey900: '#333',
        grey700: '#666',
        grey500: '#999',
        grey300: '#ccc',
        grey200: '#aaa',
        grey100: '#eee',
        grey050: '#f8f8f8',
        white: '#fff',

        // Primary Palette
        red: '#e62b1e',
        rippleBlue: '#6eebfc',

        // Primary Palette Shades
        redDark: '#cb2d3e',
        redLight: '#ef473a',

        // Primary Palette Variants
        redGradient: 'linear-gradient(180deg, $red__dark 0%, $red__light 100%)',
        redGradient45: 'linear-gradient(315deg, $red__dark 0%, $red__light 100%)',
        redHoverOpaque: 'rgba(203, 45, 62, 0.35)',

        // UI System Palette
        systemRed: '#e62b1e',
        systemGreen: '#0fbb09',
        systemOrange: '#f09e23',

        // UI System Background Palette
        redBackground: '#FFF4F4',
        rippleBlueBackground: '#dbf0f8',

        // Color Roles | UI Highlights
        paletteHighlighter: '#e62b1e',

        // Color Roles | Background
        colorPageBackground: '#fcfcfc',

        // Color Roles | Typography
        colorText: '#111',
        colorTextHint: '#999',
        colorTextSecondary: '#666',

        // Color Roles | Status
        colorNews: '#0fbb09',
        colorPromotion: '#e62b1e',
        colorCrisis: '#e62b1e',
        colorError: '#e62b1e',
        colorPositive: '#0fbb09',
        colorNegative: '#e62b1e',
        colorWarning: '#f09e23',
        colorNotification: '#e62b1e',

        // Color Roles | Links
        colorLink: '#e62b1e',
        colorLinkHover: '#cb2d3e',

        // Color Roles | UI
        colorUIAccent: '#6eebfc',
        colorBorder: '#aaa',
        colorOverlay: 'rgba(0,0,0,0.3)',
    },
    system: {
        // System Unit of Measurement
        systemUnit: '16px',

        // System Spacing
        space0: '256px',
        space1: '128px',
        space2: '96px',
        space3: '64px',
        space4: '48px',
        space5: '32px',
        space6: '24px',
        space7: '20px',
        space8: '16px',
        space9: '12px',
        space10: '8px',
        space11: '4px',
        space12: '2px',

        // System Appearance
        systemRadius: '0px',
        systemBorder: '1px solid #aaa',
        systemShadow: '0 2px 6px 0 hsla(0,0%,45%,0.2)',

        // System Z-Index
        systemZIndexUI: '1000',
        systemZIndexOverlay: '100000',

        // System Container Width
        systemContainerWidth: '90vw',
        systemContainerMaxWidth: '1200px',
        systemNarrowContainerMaxWidth: '720px',
        systemExtendedContainerMaxWidth: '992px',
        systemExtendedContainerMaxWidthTablet: '608px',

        // System Breakpoints
        viewportXX: '320px',
        viewportXS: '375px',
        viewportSmall: '576px',
        viewportMedium: '768px',
        viewportLarge: '1025px',
        viewportXL: '1200px',
        viewportXXL: '1440px',

        // System Transition
        transitionDefault: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transitionQuick: 'all 0.1s',
    },
    typography: {
        // Type Sizing
        systemFontSize: '1rem',
        systemLineHeight: '1.6',

        // Typefaces
        fontSansSerif: 'Helvetica, Arial, sans-serif',
        fontSerif: '\'Recoleta\', Georgia, Times, \'Times New Roman\', serif',
        fontMonospace: '\'Lucida Sans Typewriter\', \'Lucida Console\', monaco, \'Bitstream Vera Sans Mono\', monospace',

        fontTitles: '\'Recoleta\', Georgia, Times, \'Times New Roman\', serif',
        systemFont: 'Helvetica, Arial, sans-serif',
    },
};

const typography = css`
    color: ${props => props.theme.color.black};
    text-rendering: optimizeLegibility;
    margin-top: 1.1875rem;
`;

const GlobalStyles = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
        font-weight: 400;
    }

    html, body {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        line-height: 1.1875rem;
        scroll-behavior: smooth;
        z-index: -20;
    }

    article,aside,details,figcaption,figure,
    footer,header,hgroup,menu,nav,section { 
        display: block;
    }

    nav ul {
        list-style: none;
    }

    a {
        vertical-align: baseline;
        background: transparent;
    }

    mark {
        background-color: ${props => props.theme.color.red};
        color: ${props => props.theme.color.black}; 
        font-style: italic;
        font-weight: bold;
    }

    del {
        text-decoration: line-through;
    }

    hr {
        display: block;
        height: 1px;
        border: 0;   
        border-top: 1px solid ${props => props.theme.color.grey900};
    }

    input, select {
        vertical-align: middle;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    /* Typography */
    h1, .h1 {
        ${typography}
        font-size: 2.0625rem;
        line-height: 2.375rem;
        margin-bottom: 1.1875rem;
    }

    h2, .h2 {
        ${typography}
        font-size: 1.625rem;
        line-height: 2.375rem;
        margin-bottom: 1.1875rem;
    }

    h3, .h3 {
        ${typography}
        font-size: 1.25rem;
        line-height: 2.375rem;
        margin-bottom: 0;
    }

    h4, .h4 {
        ${typography}
        font-size: 1rem;
        line-height: 1.1875rem;
        margin-bottom: 0;
    }

    h5, .h5 {
        ${typography}
        font-size: 1rem;
        line-height: 1.1875rem;
        margin-bottom: 0;
    }

    h6, .h6 {
        ${typography}
        font-size: 1rem;
        line-height: 1.1875rem;
        margin-bottom: 1.1875rem;
        font-weight: 400;
    }

    p {
        font-size: 1rem;
        color: ${props => props.theme.color.grey900};
        margin-bottom: 1.3rem;
        line-height: 1.4rem;
    }

    p, ul, ol, pre, table, blockquote {
        margin-top: 0;
        margin-bottom: 1.1875rem;
    }

    hr, .hr {
        border: 1px solid;
        margin: -1px 0;
    }

    sub, sup {
        line-height: 0;
        position: relative;
        vertical-align: baseline;
    }

    a {
        color: ${props => props.theme.color.red};
        text-decoration: none;
    }

    small {
        font-size: 0.7rem;
        line-height: inherit;
    }

    del {
        text-decoration: line-through;
    }

    code {
        margin: 0 .3rem;
        padding: .3rem .6rem;
        white-space: nowrap;
        background: ${props => props.theme.color.grey050};
        border: 1px solid ${props => props.theme.color.grey050};
        border-radius: 3px;
    }

    /**
     * iOS Mobile Status Bar Hack
     *
     * manifest.json settings did not appropriately adjust theme, so we added
     * a 300px pseudo-element on the body floating above the app as a fix.
     * Should attempt to refactor and solve when possible.
     *
     **/
    body::before {
        content: '';
        top: 0;
        left: 0;
        background: ${props => props.theme.color.colorPageBackground};
        z-index: -2;
        width: 100vw;
        height: 100vh;
        position: fixed;
    }

    body::after {
        content: '';
        top: -300px;
        left: 0;
        background: ${props => props.theme.color.redDark};
        z-index: 10;
        width: 100vw;
        height: 300px;
        position: fixed;
    }

    /**
     * Burger Menu Customization Hack
     *
     * welp, this is unfortunate... cannot customize burger well so
     * used inspector to edit styling, which makes it hard to modularize
     * or customize. Should be fixed with custom burger menu eventually.
     */
    .bm-burger-button {
        position: fixed;
        width: 36px;
        height: 24px;
        right: 26px;
        top: 42px;
    }

    .bm-burger-bars {
        background: ${props => props.theme.color.red};
    }

    .bm-cross-button {
        height: 50px !important;
        width: 50px !important;
        height: 24px;
        width: 36px;
        right: 26px;
        top: 42px;
    }

    .bm-cross-button button {
        top: 20px !important;
        left: -20px !important;
    }

    .bm-cross {
        background: ${props => props.theme.color.white};
        right: 20px;
        top: 25px;
        height: 30px !important;
        width: 3px !important;
    }

    .bm-menu-wrap {
        position: absolute;
        top: 0;
        width: 100% !important;
        background-color: rgba(0,0,0,0.1);
    }

    .bm-menu {
        background: ${props => props.theme.color.redGradient};
        padding: 0;
        font-size: 1.4rem;
        width: 100%;
        position: absolute;
        top: 0;
        right: 0;
    }

    .bm-menu ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .bm-morph-shape {
        fill: var;
    }

    .bm-item-list {
        display: flex;
        justify-content: center !important;
        color: ${props => props.theme.color.white};
        padding: 0.8em;
        text-align: center !important;
        position: relative;
    }
`;

function Page(props) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Meta />
            {props.children}
        </ThemeProvider>
    );
}

export default Page;
