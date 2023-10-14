<template>
  <div class="base-wrapper">
    <div class="map">
      <yandex-map :coords="coords" :zoom="8" style="width: 100%; height: 100%">
        <ymap-marker
          marker-id="123"
          :coords="coords"
          hint-content="some hint"
        />
      </yandex-map>
    </div>
    <div class="actions-wrapper pa-3">
      <v-btn
        width="100%"
        height="45"
        solo
        elevation="0"
        class="blue darken-3 rounded-xl mt-2"
      >
        Выбрать услугу
      </v-btn>
      <v-divider class="mt-3 mb-3 grey lighten-2"></v-divider>
      <div class="points-preview">
        <v-card
          v-for="point in 2"
          :key="`${point}-pt`"
          width="50%"
          flat
          :height="120"
          class="white grey lighten-3"
        >
        </v-card>
      </div>
      <v-divider class="mt-3 mb-3 grey lighten-2"></v-divider>
      <v-btn
        outlined
        width="100%"
        class="black--text"
        large
        @click="searchModal = true"
      >
        <v-icon class="mr-2"> mdi-format-list-group </v-icon>
        Показать все отделения
      </v-btn>
      <div
        class="search-box-container"
        :class="{ 'search-box-container--open': searchModal }"
      >
        <template v-if="searchModal">
          <v-btn class="mt-2" absolute right icon @click="searchModal = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <BanksFilter />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import BanksFilter from '../components/BanksFilter.vue'

export default {
  name: 'IndexPage',
  components: {
    yandexMap,
    ymapMarker,
    BanksFilter,
  },
  data() {
    return {
      coords: [54.82, 39.83],
      searchModal: false,
    }
  },
}
</script>
<style scoped lang="scss">
.base-wrapper {
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 4fr 3fr;
  .map {
  }
  .actions-wrapper {
    position: relative;
    background-color: #fff;
    height: 100%;

    .points-preview {
      display: flex;
      flex-wrap: nowrap;
      gap: 10px;
    }
    .search-box-container {
      position: absolute;
      left: 0;
      height: 0;
      bottom: 0;
      width: 100%;
      transition: all linear 0.2s;
      &--open {
        height: 100%;
        background-color: black;
      }
    }
  }
}
</style>
