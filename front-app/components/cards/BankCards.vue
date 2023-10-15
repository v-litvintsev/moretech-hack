<template>
  <vue-scroll-snap
    v-if="officesList.length"
    :horizontal="true"
    class="points-preview remove-thumb"
  >
    <div v-for="(point, idx) in officesList" :key="idx">
      <v-card
        flat
        class="lighten-3 rounded-card card-width pa-4 card-position"
        color="white"
        style="border: 1px solid black !important"
        outlined
        height="140"
      >
        <div class="black--text">
          <h3>{{ title }}</h3>
          <div class="text-clamp">{{ point.address || '' }}</div>
        </div>
        <div class="path-btn-position">
          <v-btn
            class="ml-4 mb-4 blue--text"
            outlined
            rounded
            small
            @click="pathButtonClick"
            >Маршрут</v-btn
          >
        </div>
      </v-card>
    </div>
  </vue-scroll-snap>
</template>

<script>
import VueScrollSnap from 'vue-scroll-snap'

export default {
  name: 'BankCards',
  components: { VueScrollSnap },
  props: ['offices', 'limitCards'],
  data() {
    return {
      // title: 'Отделение банка',
      title: '', // 'Отделение банка' || 'Офис'
    }
  },
  computed: {
    officesList() {
      if (this.limitCards > 0) {
        return this.offices.slice(0, this.limitCards)
      }
      return this.offices
    },
  },
  methods: {
    pathButtonClick() {
      // TODO
      console.log('draw path to office')
    },
  },
}
</script>

<style scoped>
.card-border.v-sheet.v-card {
  border-width: 2px;
}

.rounded-card.v-sheet.v-card {
  border-radius: 1rem;
}

.remove-thumb::-webkit-scrollbar {
  width: 0;
}

.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scroll-snap-container {
  width: 100%;
}

.card-width {
  min-width: 50vw;
}

.card-position {
  position: relative;
}

.path-btn-position {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
