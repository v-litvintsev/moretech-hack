<template>
  <div class="mt-2">
    <v-card-title>
      <v-text-field
        v-model="search"
        label="Найти"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-data-table
      :headers="headers"
      :items="banksList"
      :search="search"
      :sortable="false"
      :hide-default-header="true"
      :hide-default-footer="true"
      :custom-filter="searchByAddress"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="custom-class">{{ item.address }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import json from '../static/json/atms.json'

export default {
  data() {
    return {
      search: '',
      fakeData: json,
      banksList: [],
      headers: [{ text: 'Address', value: 'address' }],
      selectedFilter: 'address',
      showCount: 10,
    }
  },
  created() {
    this.getBanksList(this.showCount)
  },
  methods: {
    getBanksList(limit) {
      const banks = this.fakeData.atms
      for (let i = 0; i < limit; i++) {
        // TODO: get active services
        // const activeServices = Array(banks[i].services).filter(
        //   (service) => service.serviceActivity === 'AVAILABLE'
        // )

        this.banksList.push({
          address: banks[i].address,
          // services: activeServices,
        })
      }
    },

    searchByAddress(items, search, filter) {
      const searchQuery = search.toString().toLowerCase()
      const words = filter.address.toLowerCase().split(' ')
      for (const w of words) {
        if (w.startsWith(searchQuery)) {
          return filter
        }
      }
    },

    searchByService(items, search, filter) {
      const searchQuery = search.toString().toLowerCase()
      const services = search.services

      for (const s of services) {
        const service = s.toLowerCase()
        if (service.startsWith(searchQuery)) {
          return filter
        }
      }
    },
  },
}
</script>

<style scoped>
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
