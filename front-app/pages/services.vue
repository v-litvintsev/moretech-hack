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
          :class="{'blue darken-2 white--text': selectType === 'individual'}"
          @click="selectType = 'individual'"
        >
          Услуги для физических лиц
        </v-btn>
        <v-btn
          x-large
          width="100%"
          class="mt-2"
          :class="{'blue darken-2 white--text': selectType === 'legal'}"
          large
          @click="selectType = 'legal'"
        >
          Услуги для юридических лиц
        </v-btn>
      </v-container>
      <v-container class="pa-0 service mt-6 rounded-xl white--text" :class="{'service--open': selectType}">
        <template v-if="selectType">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-data-table
            hide-default-footer
            hide-default-header
            :headers="headers"
            :items="serviceList"
            :search="search"
            @click:row="setFilter($event)"
          ></v-data-table>
        </template>
      </v-container>
      <v-btn
        v-if="selectType"
        width="100%"
        class="mt-6"
        :disabled="!(Boolean(selectService) && Boolean(selectType))"
        @click="goMain()">
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
      service: null,
      selectType: '',
      selectService: '',
      search: '',
      headers: [{
        text: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        value: 'name',
      },]
    }
  },
  fetch() {
    this.$axios.$get('api/get-services')
      .then(res => {
        this.service = res
      })
  },
  computed: {
    serviceList() {
      return this.service[this.selectType]
    }
  },
  methods: {
    setFilter({name}) {
      this.selectService = name
    },
    goMain() {
      this.$store.commit('name',this.selectService)
      this.$store.commit('userType', this.selectType)
      this.$router.push(`/`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-wrapper {
    position: relative;
    .service {
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
