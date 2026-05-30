/**
 * SalesLens color tokens — sourced from saleslens_theme_palette.html
 * Use semantic names in components; switch palette via getTheme(colorScheme).
 */

export const lightColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F4F0',
    tertiary: '#ECEAE3',
    accent: '#E6F1FB',
  },
  text: {
    primary: '#1B2A4A',
    secondary: '#5F5E5A',
    tertiary: '#888780',
    accent: '#185FA5',
  },
  border: {
    primary: '#D3D1C7',
    tertiary: '#D3D1C7',
  },
  status: {
    positive: { background: '#E1F5EE', text: '#085041', main: '#1D9E75' },
    caution: { background: '#FAEEDA', text: '#633806', main: '#EF9F27' },
    behind: { background: '#FAECE7', text: '#712B13', main: '#D85A30' },
    error: { background: '#FCEBEB', text: '#791F1F', main: '#E24B4A' },
  },
  chart: {
    primary: '#378ADD',
    secondary: '#85B7EB',
  },
};

export const darkColors = {
  background: {
    primary: '#1E1E1C',
    secondary: '#2C2C2A',
    tertiary: '#141413',
    accent: '#042C53',
  },
  text: {
    primary: '#F1EFE8',
    secondary: '#B4B2A9',
    tertiary: '#888780',
    accent: '#85B7EB',
  },
  border: {
    primary: '#444441',
    tertiary: '#444441',
  },
  status: {
    positive: { background: '#085041', text: '#9FE1CB', main: '#5DCAA5' },
    caution: { background: '#633806', text: '#FAC775', main: '#EF9F27' },
    behind: { background: '#712B13', text: '#F5C4B3', main: '#F0997B' },
    error: { background: '#791F1F', text: '#F7C1C1', main: '#F09595' },
  },
  chart: {
    primary: '#378ADD',
    secondary: '#185FA5',
  },
};
