/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue Theme
import ArgusPreset from './plugins/primevue.js'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'


// Componentes
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Paginator from "primevue/paginator";
import Dialog from "primevue/dialog";
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Drawer from 'primevue/drawer';
import Select from 'primevue/select';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Dropdown from 'primevue/dropdown';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DatePicker from 'primevue/datepicker';
import Calendar from 'primevue/calendar';

// Servicios
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

const app = createApp(App)

// Pinia
app.use(createPinia())
// Router
app.use(router)

// PrimeVue

// Configurar Locale ES
const localeES = {
    firstDayOfWeek: 1,
    dayNames: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
    dayNamesShort: ["dom","lun","mar","mié","jue","vie","sáb"],
    dayNamesMin: ["D","L","M","M","J","V","S"],
    monthNames: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
    monthNamesShort: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    today: "Hoy",
    clear: "Limpiar"
};

app.use(PrimeVue, {
  locale: localeES,
  theme: {
    preset: ArgusPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ConfirmationService)
app.use(ToastService)

// === Registrar componentes globales ===
// eslint-disable-next-line vue/multi-word-component-names
app.component("Button", Button);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Tag", Tag);
app.component("Paginator", Paginator);
app.component("Dialog", Dialog);
app.component('InputText', InputText);
app.component('Checkbox', Checkbox);
app.component('Drawer', Drawer);
app.component('Select', Select);
app.component('Card', Card);
app.component('Dropdown', Dropdown);
app.component('ProgressBar', ProgressBar);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('DatePicker', DatePicker);
app.component('Calendar', Calendar);

// Montar la aplicación

app.mount('#app')
