import { createApp } from 'vue'
import App from './App.vue'

import '@material/web/all.js'
import './styles/main.css'

const DARK_KEY = 'm3eblog_dark_mode'
const THEME_KEY = 'm3eblog_theme'

const darkMode = localStorage.getItem(DARK_KEY)
if (darkMode === 'true') {
  document.documentElement.classList.add('dark')
} else if (darkMode === null) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem(DARK_KEY, 'true')
  } else {
    localStorage.setItem(DARK_KEY, 'false')
  }
} else {
  document.documentElement.classList.remove('dark')
}

const themes: Record<string, any> = {
  purple: {
    light: { primary: '#6750A4', onPrimary: '#FFFFFF', primaryContainer: '#EADDFF', onPrimaryContainer: '#21005D', headerBg: '#6750A4', headerFg: '#FFFFFF', panelBg: '#F5F0FA' },
    dark: { primary: '#D0BCFF', onPrimary: '#381E72', primaryContainer: '#4F378B', onPrimaryContainer: '#EADDFF', headerBg: '#4F378B', headerFg: '#EADDFF', panelBg: '#1E1A24' }
  },
  blue: {
    light: { primary: '#0061A4', onPrimary: '#FFFFFF', primaryContainer: '#D1E4FF', onPrimaryContainer: '#001D36', headerBg: '#0061A4', headerFg: '#FFFFFF', panelBg: '#F0F5FA' },
    dark: { primary: '#9ECAFF', onPrimary: '#003258', primaryContainer: '#00497D', onPrimaryContainer: '#D1E4FF', headerBg: '#00497D', headerFg: '#D1E4FF', panelBg: '#141C24' }
  },
  teal: {
    light: { primary: '#006A6A', onPrimary: '#FFFFFF', primaryContainer: '#6FF7F7', onPrimaryContainer: '#002020', headerBg: '#006A6A', headerFg: '#FFFFFF', panelBg: '#F0F8F8' },
    dark: { primary: '#4CDCDC', onPrimary: '#003737', primaryContainer: '#004F4F', onPrimaryContainer: '#6FF7F7', headerBg: '#004F4F', headerFg: '#6FF7F7', panelBg: '#142020' }
  },
  green: {
    light: { primary: '#386A20', onPrimary: '#FFFFFF', primaryContainer: '#B8F397', onPrimaryContainer: '#042100', headerBg: '#386A20', headerFg: '#FFFFFF', panelBg: '#F2F7F0' },
    dark: { primary: '#9DD67E', onPrimary: '#0D3900', primaryContainer: '#1F5107', onPrimaryContainer: '#B8F397', headerBg: '#1F5107', headerFg: '#B8F397', panelBg: '#162014' }
  },
  coral: {
    light: { primary: '#A03818', onPrimary: '#FFFFFF', primaryContainer: '#FFDBCF', onPrimaryContainer: '#3A0B00', headerBg: '#A03818', headerFg: '#FFFFFF', panelBg: '#FAF2F0' },
    dark: { primary: '#FFB4A0', onPrimary: '#5E1700', primaryContainer: '#7E2B0D', onPrimaryContainer: '#FFDBCF', headerBg: '#7E2B0D', headerFg: '#FFDBCF', panelBg: '#241814' }
  }
}

const savedTheme = localStorage.getItem(THEME_KEY) || 'purple'
const theme = themes[savedTheme] || themes.purple
const isDark = document.documentElement.classList.contains('dark')
const colors = isDark ? theme.dark : theme.light
const root = document.documentElement.style
root.setProperty('--md-sys-color-primary', colors.primary)
root.setProperty('--md-sys-color-on-primary', colors.onPrimary)
root.setProperty('--md-sys-color-primary-container', colors.primaryContainer)
root.setProperty('--md-sys-color-on-primary-container', colors.onPrimaryContainer)
root.setProperty('--header-bg', colors.headerBg)
root.setProperty('--header-fg', colors.headerFg)
root.setProperty('--panel-bg', colors.panelBg)

createApp(App).mount('#app')