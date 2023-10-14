<template>
  <div class="base-wrapper">
    <div class="map">
      <div class="atm-switcher black rounded-xl pt-1 pb-1 pr-2 pl-2">
        <v-switch v-model="atmsStatus" class="ma-0 pt-0" hide-details label="ATM" />
      </div>
      <l-map
        style="height: 100%; width: 100%"
        :zoom="zoom"
        :center="currentCenter"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdated"
      >
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker :lat-lng="center">
          <l-icon>
            <v-icon large color="blue" class="darken-2">
              mdi-map-marker
            </v-icon>
          </l-icon>
        </l-marker>
        <v-marker-cluster>
        <l-marker
          v-for="(item, idx) in officeList"
          :key="`office-${idx}`"
          :lat-lng="[item.latitude, item.longitude]">
          <l-icon>
            <v-icon large color="blue" class="darken-2">
              mdi-circle
            </v-icon>
          </l-icon>
        </l-marker>
        <template v-if="atmsStatus">
          <l-marker
            v-for="(item, idx) in atmList"
            :key="`atm-${idx}`"
            :lat-lng="[item.latitude, item.longitude]">
            <l-icon>
              <v-icon large color="blue" class="text--accent-3">
                mdi-circle
              </v-icon>
            </l-icon>
          </l-marker>
        </template>
        </v-marker-cluster>
        <l-routing-machine v-if="officeList.length" :waypoints="getWaypoints"/>
      </l-map>
    </div>
    <div class="actions-wrapper pa-3">
      <v-btn
        width="100%"
        height="45"
        solo
        elevation="0"
        class="blue darken-3 rounded-xl mt-2"
        @click="$router.push('/services')"
      >
        Выбрать услугу
      </v-btn>
      <v-divider class="mt-3 mb-3 grey lighten-2"></v-divider>
      <div v-if="officeList.length" class="points-preview">
        <v-card
          v-for="(point, idx) in [officeList[0], officeList[1]]"
          :key="`${idx}-pt`"
          width="50%"
          flat
          :height="120"
          class="white grey lighten-3 overflow-hidden black--text"
        >
          {{point.address || ''}}
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
import { latLng } from 'leaflet'
import {LMap, LMarker, LTileLayer, LIcon} from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import LRM from '@/components/LRM'


export default {
  name: 'IndexPage',
  components: {
    'v-marker-cluster': Vue2LeafletMarkerCluster,
    'l-routing-machine': LRM,
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },
  data() {
    return {
      atmsStatus: false,
      currentCenter: latLng(55.6908465, 37.5595371),
      center: latLng(55.6908465, 37.5595371),
      searchModal: false,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 11,
      bounds: null,
      officeList: [],
      filtersOfficeList:[],
      atmList: [],
      currentPint: null,
    }
  },
  fetch() {
    this.$axios.$get('api/get-map-items')
      .then(res => {
        this.officeList = res.offices.reverse();
        this.atmList = res.atms;
      })
    if (this.$store.state.name && this.$store.state.userType) {
      this.$axios.$post('api/get-offices', {
        service: this.$store.state.name,
        userType: this.$store.state.userType
      }).then(res => {
        this.filtersOfficeList = res.offices
        this.$store.commit('name',null)
        this.$store.commit('userType', null)
      })
    }
  },
  created() {
    const success = (position) => {
      this.latitude  = position.coords.latitude;
      this.longitude = position.coords.longitude;
    };
    const error = (err) => {
      console.log(err);
    };
    navigator.geolocation.getCurrentPosition(success, error);
  },
  computed: {
    getWaypoints() {
      return [
        {...this.center},
        {lat: this.officeList[0].latitude, lng: this.officeList[0].longitude}
      ]
    }
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  }
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
    position: relative;
    .atm-switcher {
      z-index: 1000;
      position: absolute;
      top: 14px;
      right: 60px;
    }
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
