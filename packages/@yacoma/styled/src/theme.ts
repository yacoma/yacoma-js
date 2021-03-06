import { defaultTheme } from '@yacoma/theme'

export const styledTheme = {
  badgeTop: '-0.8rem',
  badgeRight: '-0.8rem',
  badgeHeight: '1.1rem',
  badgeWidth: '1.15rem',
  badgeBorder: '1px solid white',
  badgeBorderRadius: '1rem',
  badgeBackground: '#ff6900e2',
  badgeLineHeight: '1.2rem',
  badgeColor: 'white',
  badgeFontSize: '0.8rem',
  buttonActiveBackground: '#bbb',
  buttonBackground: '#ccc',
  buttonHoverBackground: '#ddd',
  buttonBorderRadius: '5px',
  buttonColor: '#222',
  buttonPrimaryActiveBackground: '#506598',
  buttonPrimaryColor: '#fff',
  buttonPrimaryBackground: '#506598',
  buttonPrimaryHoverBackground: '#7287ba',
  buttonMargin: '1rem',
  buttonLargeWidth: '12rem',
  buttonLargePadding: '0.5rem 0.9rem',
  buttonWidth: '7rem',
  buttonPadding: '0.5rem 0.6rem',
  cardBackground: '#eee',
  cardBorder: '1px solid #5f6471',
  cardBorderRadius: '5px',
  cardBoxShadow: '4px 14px 50px rgba(0, 0, 0, 0.3)',
  cardColor: '#333',
  // Used by other libs to set color of separators in
  // card parts.
  cardItemBorder: '1px solid #808080',
  cardLargeWidth: '36rem',
  cardMediumWidth: '24rem',
  cardTitleBackground: '#506598',
  cardTitleColor: '#fff',
  cardWidth: '18rem',
  errorMessageBackground: '#f9d7d7',
  errorMessageBorder: '1px solid #c39a9a',
  errorMessageColor: '#dc6565',
  errorMessagePadding: '1rem',
  errorMessageBorderRadius: '5px',
  fieldCheckedBackground: '#f3d3ec',
  fieldIconBackground: '#ccc',
  fieldIconPadding: '0 0.5rem',
  fieldBorder: '1px solid #ccc',
  fieldMargin: '1rem',
  fieldBorderRadius: '2px',
  iconDisabledOpacity: '0.5',
  iconLargeFontSize: '1.6rem',
  iconLargeMargin: '0.3rem',
  iconMediumFontSize: '1.3rem',
  iconMediumMargin: '0.3rem',
  iconMargin: '0.4rem',
  inputColor: '#333',
  inputResetColor: '#d2d8e2',
  inputResetColorHover: '#94a1c1',
  inputBorderRadius: '5px',
  inputBackground: '#eee',
  inputFontSize: '1rem',
  inputLineHeight: '1.6rem',
  inputPadding: '0.2rem 0.5rem 0 0.5rem',
  inputPlaceholderColor: '#a5a5a5',
  inspectorWidth: 'var(--cardWidth)',
  inspectorIconHighColor: '#3c92e0',
  inspectorTitleHeight: '1.8rem',
  inspectorTitleFontSize: '1.2rem',
  inspectorTitleBackground: '#4c596b',
  inspectorTitleColor: '#d1e2ff',
  inspectorTitleBorderBottom: '1px solid #2d3b48',
  inspectorWidgetBackground: '#b6cae6',
  inspectorWidgetBorderLeft: '1px solid #79879a',
  messageMargin: '2rem 1rem',
  modalBackground: 'rgba(144, 144, 144, 0.83)',
  modalBackdropFilter: 'blur(1.5px)',
  modalTop: '20vh',
  // Height to width ratio
  pageRatio: 297 / 210,
  // This width, pageHeader and pageFooter MUST be expressed in pixels because
  // the values are used to compute available page height for content (in px).
  pageBoxShadow: '0 0.5mm 2mm rgba(0, 0, 0, 0.3)',
  pageWidth: '1024px',
  pageFooterHeight: '100px',
  pageHeaderHeight: '100px',
  pageMarginLeftRight: '64px',
  pageMarginTopBottom: '64px',
  pageOuterMargin: '41px 0',
  roundInputLightBackground: '#ececec',
  roundInputBackground: '#ddd',
  roundInputBorderRadius: '1rem',
  roundInputPadding: '0.2rem 0.5rem 0.2rem 0.8rem',
  roundInputResetTop: '0.1rem',
  roundInputResetRight: '0px',
  roundInputResetColor: '#bbb',
  separatorBorder: '1px solid #bbb',
  separatorBorderWidth: '1px 0 0 0',
  optionPadding: '3px 5px',
  optionColor: '#333',
  optionBackground: 'var(--cardBackground)',
  optionHoverColor: '#333',
  optionHoverBackground: '#ffd588',
  optionSelectedColor: '#333',
  optionSelectedBackground: '#ffd588',
  tableBackground: '#e6e6e6',
  tableHeaderColor: '--var(tableItemColor)',
  tableHeaderBackground: '#b3bcd6',
  tableItemColor: '#444',
  tableItemBackgroundEven: 'none',
  tableItemBackgroundOdd: '#e0e0e0',
  tableItemBorder: 'none',
  tableItemHoverBackground: '#afafaf',
  tableItemIdent: '29px',
  titleTextMargin: '0.5rem 0.6rem 0.3rem',
}

export const styledDefaultTheme = Object.assign({}, defaultTheme, styledTheme)
