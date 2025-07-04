import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { pl } from 'vuetify/locale'


const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'pl',
    messages: { pl },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)


app.mount('#app')
