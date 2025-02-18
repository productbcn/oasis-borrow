import { slideInAnimation } from './animations'
import { icons } from './icons'

// Duplication from theme as exporting const from package library is breaking dai-ui website and theme-ui doesn't support yet transitions tokens :(
// To refactor if they will include this support
export const TRANSITIONS = {
  global: '150ms cubic-bezier(0.215,0.61,0.355,1)',
}

export const GRADIENTS = {
  newsletterSuccess: 'linear-gradient(137.02deg, #2A30EE 0%, #A4A6FF 99.12%);',
}

const oasisBaseTheme = {
  useBorderBox: true,
  useBodyStyles: true,
  breakpoints: ['48em', '60em', '68em'],
  colors: {
    primary: '#25273D',
    primaryAlt: '#D3D4D8',
    primaryEmphasis: '#626472',

    secondary: '#ECEFF9',
    secondaryAlt: '#F3F7F9',

    background: '#FFF',
    backgroundAlt: '#F1F3F4',
    surface: '#FFF',

    fadedWhite: 'rgba(255, 255, 255, 0.5)',
    light: '#D1DEE6',
    lightIcon: '#BEC9D0',
    border: '#EAEAEA',
    borderSelected: '#A8A9B1',
    offBlue: '#CAD6DB',
    offWhite: '#F6F8F9',
    grey: {
      darker: '#E6E9EB',
    },

    text: {
      focused: '#272940',
      muted: '#708390',
      off: '#686986',
      subtitle: '#787A9B',
      contrast: '#FFF',
    },

    link: '#575CFE',
    textAlt: 'rgba(37, 39, 61, 0.67)',
    onBackground: '#9FAFB9',
    onPrimary: '#FFF',
    onSurface: '#708390',
    muted: '#708390',
    mutedAlt: '#656F75',
    error: '#FDEDE8',
    onError: '#F75524',
    dimError: 'rgba(247, 85, 36, 0.1)',
    success: '#E7FCFA',
    dimSuccess: 'rgba(26, 171, 155, 0.1)',
    onSuccess: '#1AAB9B',
    warning: '#FFF1CF',
    onWarning: '#D8762D',
    lavender: '#787A9B',
    lavender_o25: '#787a9b40',
    banner: {
      warning: '#FF6A16',
      danger: '#FE4343',
      muted: 'primary',
      dangerBorder: '#FBE1D9',
    },
    counter: {
      primary: '#FF7B31',
      secondary: '#FEB343',
      surface: '#FFDBC7',
    },
    bull: '#1AAB9B',
    bear: '#F75524',
    sliderTrackFill: '#9DA3DA',
    sliderActiveFill: '#878BFC',
    actionInputHover: '#E5E7E8',
    selected: '#EDEDFF',
    fogBlue: '#D8D9FE',
    maritimeBlue: '#26283E',
    newsletterInputBorder: 'rgba(120, 122, 155, 0.25)',
  },
  fonts: {
    body: '"Inter", "Helvetica Neue", sans-serif',
    heading: '"FT Polar Trial", "Helvetica Neue", sans-serif',
    monospace: 'monospace',
  },
  //           0   1   2   3   4   5   6   7   8   9  10
  fontSizes: [10, 12, 14, 16, 18, 20, 24, 32, 52, 64, 96],
  fontWeights: {
    body: 400,
    heading: 500,
    medium: 500,
    semiBold: 600,
    bold: 700,
    heavy: 900,
  },
  lineHeights: {
    body: 1.5,
    bodyLoose: 1.7,
    heading: 1.2,
    tight: 1.05,
    loose: 1.35,
    //
    buttons: '2.1em',
    secondaryButton: 0.8,
    smallButton: 1.9,
  },
  text: {
    display: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      fontSize: [7, 8],
    },
    header1: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: '52px',
      color: 'primary',
    },
    header2: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: 7,
      color: 'primary',
    },
    header3: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'heading',
      fontSize: 5,
      color: 'primary',
    },
    header4: {
      fontFamily: 'body',
      fontWeight: 'semiBold',
      lineHeight: 'heading',
      fontSize: 4,
      color: 'primary',
    },
    headerSettings: {
      // deprecated, use header4
      variant: 'text.header4',
    },
    paragraph1: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 4, // 18px
      color: 'primary',
    },
    paragraph2: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 3, // 16px
      color: 'primary',
    },
    paragraph3: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 2, // 14px
      color: 'primary',
    },
    paragraph4: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 1, // 12px
      color: 'primary',
    },
    subheader: {
      variant: 'text.paragraph2',
      color: 'text.subtitle',
    },
    caption: {
      variant: 'text.paragraph4',
      fontWeight: 'heading',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      opacity: 0.7,
    },
    tableHead: {
      variant: 'text.paragraph3',
      color: 'muted',
      fontWeight: 'semiBold',
    },
    strong: {
      variant: 'text.paragraph2',
      fontWeight: 'semiBold',
    },
    light: {
      color: 'lavender',
      fontSize: 4,
      lineHeight: 'bodyLoose',
      a: {
        variant: 'text.paragraph1',
        color: 'text.focused',
      },
    },
    address: {
      variant: 'paragraph3',
      fontWeight: 'medium',
      letterSpacing: '0.02em',
    },
    label: {
      fontFamily: 'body',
      fontWeight: 'semiBold',
      lineHeight: 'body',
      fontSize: 1,
      color: 'text.subtitle',
    },
  },
  borders: {
    light: '1px solid #787a9b40',
    lightMuted: '1px solid #F0F0F0',
    bold: '3px solid #D3D4D8',
  },
  //      0  1  2   3   4   5    6    7    8
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: {
    small: 4,
    medium: 8,
    mediumLarge: 12,
    large: 16,
    roundish: 20,
    rounder: 24,
    round: 32,
    circle: 50,
  },
  shadows: {
    card: '0px 0px 8px rgba(37, 39, 61, 0.1)',
    cardLanding: '0px 0px 8px rgba(0, 0, 0, 0.1)',
    fixedBanner: '0px 0px 16px rgba(0, 0, 0, 0.1)',
    selectMenu: '0px 0px 16px rgba(0, 0, 0, 0.15)',
    medium: '0 2px 8px rgba(0, 0, 0, 0.17)',
    light: '0 2px 8px rgba(0, 0, 0, 0.13)',
    surface: '0px 0px 8px rgba(0, 0, 0, 0.2)',
    surface_hovered: '0px 8px 8px rgba(0, 0, 0, 0.2)',
    table: '0px 0px 2px rgba(0, 0, 0, 0.2)',
    table_hovered: '0px 0px 10px rgba(0, 0, 0, 0.15)',
    banner: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    sliderThumb: '0px 1px 6px rgba(0, 0, 0, 0.15)',
    vaultEditingController: '0px 1px 6px rgba(37, 39, 61, 0.15)',
    vaultHistoryItem: '0px 1px 4px rgba(37, 39, 61, 0.12)',
    tooltipVaultHeader: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    buttonMenu: '0px 0px 8px rgba(0, 0, 0, 0.1)',
    vaultDetailsCard: '0px 1px 8px rgba(37, 39, 61, 0.1)',
    actionCard: '0px 2px 6px rgba(37, 39, 61, 0.25)',
    elevation: '0px 4px 28px rgba(37, 39, 61, 0.36)',
    userSettingsOptionButton: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    bottomSheet: '0px 4px 28px rgba(37, 39, 61, 0.3)',
  },
  gradients: {
    app: 'linear-gradient(180deg, #EAFFFB 0.01%, #EAF0FF 24.48%, rgba(255, 255, 255, 0) 100%)',
  },
  layout: {
    container: {
      maxWidth: '1200px',
      px: 3,
      '@media screen and (min-width: 1232px)': {
        px: 0,
      },
    },
    appContainer: {
      variant: 'layout.container',
    },
    marketingContainer: {
      variant: 'layout.appContainer',
    },
    marketingSmallContainer: {
      variant: 'layout.appContainer',
      maxWidth: '804px',
    },
    landingContainer: {
      variant: 'layout.appContainer',
    },
    termsContainer: {
      variant: 'layout.appContainer',
      maxWidth: '712px',
      mt: 5,
    },
    modal: {
      variant: 'layout.appContainer',
    },
    modalHalf: {
      variant: 'layout.modal',
      minHeight: '50vh',
    },
    vaultPageContainer: {
      maxWidth: ['400px', '1232px'],
      zIndex: 1,
      position: 'relative',
      ...slideInAnimation,
    },
    announcement: {
      maxWidth: '792px',
      alignSelf: 'center',
      zIndex: 4,
    },
    buttonPair: {
      minWidth: '200px',
      width: 'unset',
    },
  },
  metadata: {
    fontLinkHref: 'https://rsms.me/inter/inter.css',
  },
  cards: {
    primary: {
      border: '1px solid',
      borderColor: 'light',
      p: 3,
      borderRadius: 'roundish',
      bg: 'surface',
    },
    surface: {
      p: 3,
      borderRadius: 'roundish',
      bg: 'surface',
      boxShadow: 'surface',
    },
    primaryWithHover: {
      variant: 'cards.primary',
      cursor: 'pointer',
      transition: '150ms cubic-bezier(0.215,0.61,0.355,1)',
      '&:hover': {
        borderColor: 'mutedAlt',
        boxShadow: 'surface',
      },
    },
    secondary: {
      p: 3,
      borderRadius: 'roundish',
      border: 'none',
      bg: 'offWhite',
    },
    secondaryRounded: {
      variant: 'cards.secondary',
      borderRadius: 'large',
    },
    danger: {
      variant: 'cards.primary',
      borderColor: 'onError',
      bg: 'error',
    },
    warning: {
      variant: 'cards.primary',
      borderColor: 'onWarning',
      bg: 'warning',
    },
    vaultFormContainer: {
      variant: 'cards.primary',
      boxShadow: ['none', 'card'],
      borderRadius: 'mediumLarge',
      p: [0, 3],
      border: ['none', 'lightMuted'],
      overflowX: ['visible', 'hidden'],
    },
    tooltip: {
      variant: 'cards.primary',
      position: 'absolute',
      boxShadow: 'surface',
      borderRadius: 'small',
      color: 'primary',
      zIndex: 1,
    },
    tooltipVaultHeader: {
      variant: 'cards.tooltip',
      boxShadow: 'tooltipVaultHeader',
      p: 2,
      bottom: '-10px',
      left: ['-80px', '-40px'],
      transform: 'translateY(100%)',
      width: ['250px', '352px'],
    },
    vaultDetailsCardModal: {
      p: 3,
      bg: 'secondaryAlt',
      borderRadius: 'large',
    },
    cookieBanner: {
      boxShadow: 'fixedBanner',
      bg: 'surface',
      borderRadius: '16px 16px 0 0',
      padding: '24px',
      pb: 3,
    },
    positionsOverview: {
      boxSizing: 'border-box',
      maxWidth: '789px',
      backgroundColor: 'background',
      opacity: '0.8',
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: 'large',
      padding: '32px',
    },
  },
  badges: {
    dsr: {
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
    onramp: {
      variant: 'badges.primary',
      px: 2,
    },
  },
  buttons: {
    primary: {
      variant: 'text.paragraph1',
      cursor: 'pointer',
      fontWeight: 'semiBold',
      borderRadius: 'round',
      lineHeight: 'buttons',
      color: 'text.contrast',
      transition: 'background 200ms',
      '&:hover, &:focus-visible': {
        bg: 'primaryEmphasis',
      },
      '&:disabled': {
        bg: 'primaryAlt',
        pointerEvents: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
    },
    tab: {
      variant: 'text.paragraph2',
      cursor: 'pointer',
      fontWeight: 'semiBold',
      paddingTop: '5px',
      paddingBottom: '5px',
      borderRadius: 'round',
      lineHeight: 'buttons',
      color: 'text.contrast',
      transition: 'background 0.2s ease-in',
      '&:focus-visible': {
        bg: 'primaryEmphasis',
      },
      '&:disabled': {
        bg: 'primaryAlt',
        pointerEvents: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
    },
    tabInactive: {
      variant: 'text.paragraph2',
      cursor: 'pointer',
      paddingTop: '5px',
      paddingBottom: '5px',
      fontWeight: 'semiBold',
      borderRadius: 'round',
      lineHeight: 'buttons',
      color: 'text.subtitle',
      transition: 'background 0.2s ease-in',
      bg: 'unset',
      '&:hover': {
        color: 'maritimeBlue',
      },
    },
    vaultTab: {
      variant: 'text.paragraph2',
      cursor: 'pointer',
      bg: 'unset',
      transition: 'background 0.2s ease-in',
      fontWeight: 'semiBold',
      color: 'primary',
      px: 3,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    vaultTabInactive: {
      variant: 'text.paragraph2',
      cursor: 'pointer',
      bg: 'unset',
      transition: 'background 0.2s ease-in',
      fontWeight: 'semiBold',
      color: 'text.subtitle',
      '&:hover': {
        color: 'primary',
      },
      px: 3,
      display: 'flex',
      alignItems: 'center',
    },
    outline: {
      variant: 'text.paragraph2',
      cursor: 'pointer',
      background: 'none',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'light',
      borderRadius: 'round',
      color: 'primary',
      fontWeight: 'semiBold',
      px: 4,
      py: 2,
      '&:focus': {
        outline: 'none',
      },
    },
    outlineSquare: {
      variant: 'text.paragraph2',
      background: 'none',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'light',
      borderRadius: 'mediumLarge',
      '&:focus': {
        outline: 'none',
      },
    },
    secondary: {
      variant: 'text.paragraph3',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      fontWeight: 'semiBold',
      bg: 'backgroundAlt',
      color: 'primary',
      borderRadius: 'round',
      px: 4,
      py: 2,
      '&:focus': {
        outline: 'none',
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
    tertiary: {
      variant: 'text.paragraph3',
      px: '24px',
      py: 2,
      fontSize: 1,
      fontWeight: 'semiBold',
      lineHeight: '20px',
      cursor: 'pointer',
      bg: 'backgroundAlt',
      color: 'primary',
      borderRadius: 'round',
      whiteSpace: 'nowrap',
      transition: 'background-color 200ms',
      '&:hover': {
        bg: 'actionInputHover',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
    square: {
      variant: 'text.paragraph2',
      bg: 'white',
      borderRadius: 'large',
      py: 3,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'light',
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        boxShadow: 'surface',
      },
    },
    expandable: {
      variant: 'text.header3',
      width: '100%',
      background: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      p: 0,
      py: 4,
      ':hover': {
        opacity: 0.7,
      },
      ':focus': {
        outline: 'none',
      },
    },
    tableHeader: {
      variant: 'text.tableHead',
      background: 'none',
      p: 0,
      cursor: 'pointer',
      ':focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        textDecoration: 'underline',
      },
    },
    filter: {
      borderRadius: 'round',
      background: 'none',
      color: 'text.muted',
      fontFamily: 'body',
      fontWeight: 'semiBold',
      cursor: 'pointer',
      boxSizing: 'border-box',
      border: '1px solid transparent',
      px: 4,
      transition: 'borderColor ease-in 0.3s, color ease-in 0.3s',
      font: '',
      ':focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        textDecoration: 'underline',
      },
      '&[data-selected="true"]': {
        border: 'light',
        color: 'primary',
      },
    },
    textual: {
      variant: 'text.paragraph3',
      fontWeight: 'semiBold',
      color: 'link',
      cursor: 'pointer',
      background: 'none',
      transition: 'opacity 200ms',
      '&:hover, &:focus-visible': {
        opacity: 0.7,
      },
      '&:focus': {
        outline: 'none',
      },
    },
    textualSmall: {
      variant: 'buttons.textual',
      fontSize: 1,
      color: 'primary',
      py: 0,
    },
    actionOption: {
      fontFamily: 'body',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: 1,
      fontWeight: 'semiBold',
      color: 'primary',
      userSelect: 'none',
      bg: 'backgroundAlt',
      px: 2,
      py: 1,
      borderRadius: 'round',
      lineHeight: 1.25,
      position: 'relative',
      '&:hover': {
        bg: 'actionInputHover',
      },
      transition: 'background-color 200ms',
    },
    actionOptionOpened: {
      variant: 'buttons.actionOption',
      borderRadius: 'mediumLarge',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    bean: {
      variant: 'buttons.actionOption',
      px: 3,
      py: 2,
      width: 'initial',
    },
    beanActive: {
      variant: 'buttons.bean',
      color: 'white',
      bg: 'primary',
      '&:hover': {
        color: 'white',
        bg: 'primary',
      },
    },
    vaultEditingController: {
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'semiBold',
      lineHeight: 'body',
      bg: 'background',
      p: 3,
      color: 'primary',
      boxShadow: 'vaultEditingController',
      borderRadius: 'inherit',
      cursor: 'pointer',
    },
    vaultEditingControllerInactive: {
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'semiBold',
      bg: 'transparent',
      color: 'text.subtitle',
      cursor: 'pointer',
      transition: TRANSITIONS.global,
      '&:hover': {
        color: 'primary',
      },
    },
    tabSwitcherTabActive: {
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'semiBold',
      lineHeight: 'body',
      bg: 'background',
      p: 3,
      color: 'primary',
      boxShadow: '0px 1px 6px rgba(37, 39, 61, 0.15)',
      borderRadius: 'inherit',
      cursor: 'pointer',
      paddingLeft: '2em',
      paddingRight: '2em',
      transition: TRANSITIONS.global,
    },
    tabSwitcherTabInactive: {
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'semiBold',
      lineHeight: 'body',
      bg: 'transparent',
      p: 3,
      color: 'text.subtitle',
      cursor: 'pointer',
      transition: TRANSITIONS.global,
      '&:hover': {
        color: 'primary',
      },
      paddingLeft: '2em',
      paddingRight: '2em',
    },
    menuButton: {
      variant: 'buttons.secondary',
      bg: 'background',
      boxShadow: 'buttonMenu',
      fontSize: [1, 2],
      minHeight: ['40px', 'auto'],
      ':hover': {
        boxShadow: 'selectMenu',
      },
      transition: TRANSITIONS.global,
    },
    menuButtonRound: {
      variant: 'buttons.menuButton',
      width: '50px',
      height: '50px',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    unStyled: {
      background: 'unset',
      border: 'unset',
      color: 'inherit',
      cursor: 'pointer',
      fontFamily: 'body',
    },
    action: {
      px: '24px',
      py: 2,
      fontFamily: 'body',
      fontSize: 1,
      fontWeight: 'semiBold',
      lineHeight: '18px',
      color: 'primary',
      backgroundColor: 'background',
      border: 'lightMuted',
      borderRadius: 'rounder',
      cursor: 'pointer',
      transition: 'border-color 200ms',
      '&:hover': {
        borderColor: 'primary',
      },
    },
    actionActive: {
      variant: 'buttons.action',
      borderColor: 'primary',
    },
    actionActiveGreen: {
      variant: 'buttons.action',
      border: 'none',
      bg: 'onSuccess',
      color: 'onPrimary',
    },
    pill: {
      px: '24px',
      py: '12px',
      color: 'text.subtitle',
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'semiBold',
      lineHeight: 'heading',
      border: 'none',
      borderRadius: 'round',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'border',
      },
      transition: 'color 200ms, background-color 200ms',
    },
    pillActive: {
      variant: 'buttons.pill',
      color: 'background',
      backgroundColor: 'link',
      '&:hover': {
        backgroundColor: 'link',
      },
    },
  },
  links: {
    unStyled: {
      all: 'unset',
    },
    inText: {
      textDecoration: 'none',
      color: '#585CF5',
    },
    primary: {
      px: 3,
      py: 2,
      variant: 'buttons.primary',
      display: 'inline-block',
      bg: 'primary',
      '&, &:visited': {
        textDecoration: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        textDecoration: 'underline',
      },
    },
    nav: {
      variant: 'text.paragraph3',
      cursor: 'pointer',
      display: 'inline-block',
      fontWeight: 'semiBold',
      transition: 'color 0.2s',
      '&, &:visited': {
        textDecoration: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:hover, &:focus-visible': {
        color: 'lavender',
      },
    },
    navFooter: {
      variant: 'links.nav',
      fontWeight: 'normal',
      fontSize: 3,
    },
    navHeader: {
      variant: 'links.nav',
      color: 'lavender',
      '&:hover, &:focus-visible': {
        color: 'primary',
      },
    },
    outline: {
      variant: 'buttons.outline',
      display: 'inline-block',
      '&, &:visited': {
        textDecoration: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        textDecoration: 'underline',
      },
    },
    secondary: {
      variant: 'buttons.secondary',
      display: 'inline-block',
      '&, &:visited': {
        textDecoration: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        textDecoration: 'underline',
      },
    },
    settings: {
      color: 'primaryEmphasis',
      fontWeight: 'medium',
      fontSize: 1,
      textDecoration: 'none',
    },
  },
  icons,
  radio: {
    color: 'offBlue',
    'input:checked ~ &': {
      color: 'onSuccess',
    },
    'input:focus ~ &': {
      color: 'onSuccess',
    },
  },
  chevronUpDown: {
    sort: {
      ml: 1,
      display: 'flex',
      width: 1,
    },
    select: {
      ml: 1,
      position: 'relative',
      top: '1px',
    },
  },
  forms: {
    label: {
      fontSize: 4,
      fontWeight: 'semiBold',
    },
    input: {
      outline: 'none',
      borderRadius: 'large',
      border: 'light',
      borderColor: 'muted',
      color: 'onSurface',
      fontWeight: 'body',
      fontFamily: 'body',
      p: 3,
      lineHeight: 'tight',
      fontSize: 5,
      '&:focus': {
        borderColor: 'primary',
        color: 'primary',
      },
      '&:disabled': {
        bg: 'background',
        pointerEvents: 'none',
      },
    },
    inputError: {
      variant: 'forms.input',
      borderColor: 'onError',
      '&:focus': {
        borderColor: 'onError',
      },
    },
    inputSecondary: {
      variant: 'forms.input',
      bg: 'backgroundAlt',
      borderRadius: 'small',
      color: 'text.subtitle',
      p: 2,
      fontSize: 2,
      lineHeight: 'bodyLoose',
      borderColor: 'primaryAlt',
    },
    search: {
      fontFamily: 'body',
      variant: 'forms.input',
      borderRadius: 'round',
      fontSize: 2,
      fontWeight: 'semiBold',
      border: '1px solid #D1DEE6',
      p: 0,
      ':focus-within': {
        //indicate that input is focused
      },
    },
    plain: {
      p: 0,
      border: 'none',
      ':focus': {
        outline: 'none',
      },
    },
    select: {
      variant: 'forms.input',
    },
    textarea: { variant: 'forms.input', lineHeight: 'body' },
    textareaError: { variant: 'forms.inputError' },
    slider: {
      color: 'primary',
      backgroundColor: 'primaryAlt',
      height: 1,
      borderRadius: 'small',
      '&::-webkit-slider-thumb': {
        boxShadow: 'sliderThumb',
        width: '20px',
        height: '20px',
        transition: TRANSITIONS.global,
      },
      '&:not([disabled]):active::-webkit-slider-thumb': {
        transform: 'scale(1.1)',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },
  alerts: {
    primary: {
      width: '100%',
      justifyContent: ['flex-start', 'center'],
    },
    readonly: {
      variant: 'alerts.primary',
      bg: 'txManagerBg',
      color: 'primary',
      borderRadius: 'large',
      fontWeight: 'body',
      px: 2,
      py: 3,
      lineHeight: 'loose',
      display: 'inline-block',
      textAlign: 'center',
    },
  },
  zIndices: {
    menu: 3,
    footer: 2,
    modal: 4,
    cookie: 5,
    modalOnMobilePanel: 5,
    mobileMenu: 6,
  },
  grids: {
    vaultContainer: {
      gap: [3, null, 4, '48px'],
      gridTemplateColumns: ['1fr', '2fr minmax(425px, 1fr)', '2fr minmax(465px, 1fr)'],
      alignItems: 'flex-start',
    },
    vaultEditingControllerContainer: {
      bg: 'backgroundAlt',
      borderRadius: '2em',
      gap: '0px',
    },
    vaultDetailsCardsContainer: {
      gridTemplateColumns: ['1fr', null, null, '1fr 1fr'],
      alignSelf: 'flex-start',
      mb: 3,
    },
    tabSwitcher: {
      bg: 'backgroundAlt',
      borderRadius: '2em',
      gap: '0px',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      fontSize: 3,
    },
    spinner: {
      default: {
        color: 'primary',
        strokeWidth: 3,
        size: 16,
        opacity: 1,
        zIndex: 1,
      },
      small: {
        variant: 'styles.spinner.default',
        size: 12,
      },
      large: {
        variant: 'styles.spinner.default',
        size: 24,
      },
      extraLarge: {
        variant: 'styles.spinner.default',
        size: 50,
      },
    },
    h1: {
      variant: 'text.header1',
    },
    h2: {
      variant: 'text.header2',
    },
    h3: {
      variant: 'text.header3',
    },
    h4: {
      variant: 'text.microHeading',
    },
    a: {
      variant: 'text.paragraph3',
      fontWeight: 'semiBold',
      textDecoration: 'none',
      cursor: 'pointer',
      color: 'link',
    },
    hr: {
      borderBottom: 'lightMuted',
      m: 0,
    },
    hrVaultFormBottom: {
      borderBottom: 'lightMuted',
      mb: -2,
      position: 'relative',
      width: 'calc(100% + 64px)',
      left: -4,
    },
    hrVaultFormTop: {
      borderBottom: 'lightMuted',
      pt: 2,
      mt: 3,
      mb: 4,
      position: 'relative',
      width: 'calc(100% + 64px)',
      left: -4,
    },
    collapsedContentContainer: {
      p: 2,
      pb: 3,
      border: 'lightMuted',
      borderTop: 'none',
      borderBottomLeftRadius: 'mediumLarge',
      borderBottomRightRadius: 'mediumLarge',
    },
  },
}

export const theme = oasisBaseTheme
export type OasisTheme = typeof oasisBaseTheme
