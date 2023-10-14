import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
  apiKey: '01e64b0d-e353-4a95-a63b-197b93f404b5',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1'
}

Vue.use(YmapPlugin, settings);
