import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/*import {
    // create naive ui
    create,
    // component
    NButton,
    NGrid,
    NGi,
    NScrollbar,
    NCheckbox
} from 'naive-ui'

const naive = create({
    components: [
        NButton,
        NGrid,
        NGi,
        NScrollbar,
        NCheckbox
    ]
})*/

import naive from 'naive-ui'

createApp(App).use(naive).mount('#app')
