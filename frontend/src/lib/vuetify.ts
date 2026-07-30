// vuetify.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'
const themeLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    'card-color': '#d0d0d0',
    surface: '#d0a038',
    primary: '#b87c4c',
    'primary-darken-1': '#0e760f',
    secondary: '#e2b659 ',
    'secondary-darken-1': '#ffffff',
    error: '#fff200',
    info: '#989cfa',
    create: '#4f54eb',
    success: '#98fa9a',
    warning: '#ff9500',
    navbar:'#ffcc5f',
    title:'#525252',
    postOdd:'#D49A6A',
    postEven:'#f4ba8c'
  },
}

const themeDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#333333',
    'card-color': '#8a8a8a',
    surface: '#4c3a33',
    primary: '#7f4d3e',
    'primary-darken-1': '#034e11',
    secondary: '#412728',
    error: '#fff200',
    info: '#989cfa',
    create: '#4f54eb',
    success: '#98fa9a',
    warning: '#ff9500',
    navbar: '#2bbd44',
    title: '#525252',
    postOdd:'#11651f',
    postEven:'#919090'
  },
}



const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // default icon set
    aliases: mdiAliases, // built-in MDI aliases
    sets: {
      mdi,
      fa,
    },
  },
  theme: {
    defaultTheme: 'themeLight',
    themes: {
      themeLight,
      themeDark,
    },
  },
})

export default vuetify
