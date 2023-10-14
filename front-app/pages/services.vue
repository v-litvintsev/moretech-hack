<template>
  <div class="base-wrapper">
    <v-btn large icon class="mt-2 ml-2" @click="$router.push('/')">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div class="mt-5 pa-3">
      <v-container class="pa-0">
        <v-btn
          x-large
          width="100%"
          large
          :class="{'blue darken-2 white--text': selectType === 'person'}"
          @click="selectType = 'person'"
        >
          Услуги для физических лиц
        </v-btn>
        <v-btn
          x-large
          width="100%"
          class="mt-2"
          :class="{'blue darken-2 white--text': selectType === 'business'}"
          large
          @click="selectType = 'business'"
        >
          Услуги для юридических лиц
        </v-btn>
      </v-container>
      <v-container class="pa-0 service mt-6 rounded-xl" :class="{'service--open': selectType}">
        <template v-if="selectType">
          {{ serviceList.length }}
        </template>
      </v-container>
      <v-btn v-if="selectType" width="100%" class="mt-6" :disabled="selectType" @click="setFilter()">
        Показать на карте
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServicePage',
  data() {
    return {
      service: [],
      selectType: '',
      selectService: ''
    }
  },
  computed: {
    serviceList() {
      return this.service.filter(item => item)
    }
  },
  methods: {
    setFilter() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .base-wrapper {
    position: relative;
    .service {
      background-color: #fff;
      height: 0;
      width: 100%;
      transition: all linear .2s;
      overflow: hidden;
      &--open {
        height: 50vh;
      }
    }
  }
</style>
