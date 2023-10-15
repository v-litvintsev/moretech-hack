<template>
  <div class="mt-2 view overflow-hidden">
    <section class="view overflow-auto">
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
        :items="banksList.slice(0, showLimit)"
        :search="search"
        :sortable="false"
        :hide-default-header="true"
        :hide-default-footer="true"
        :custom-filter="defaultSearch"
        fixed-header
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="custom-class pa-3">
              <h4 class="mb-2">{{ item.salePointName }}</h4>
              {{ item.address }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </section>
  </div>
</template>

<script>
export default {
  props: ['offices', 'showLimit'],
  data() {
    return {
      search: '',
      headers: [{ text: 'Address', value: 'address' }],
      selectedFilter: 'address',
    }
  },
  computed: {
    banksList() {
      return this.getBanksList()
    },
  },
  methods: {
    getBanksList() {
      const banks = []

      for (const office of this.offices) {
        // check if open
        // if (office.status === 'открытая') {
        banks.push({
          salePointName: office.salePointName, // for searching by name
          address: office.address, // for searching by address
          distance: office.distance, // sorting by distance
        })
        // }
      }

      return banks

      // TODO: get active services
      // const activeServices = Array(banks[i].services).filter(
      //   (service) => service.serviceActivity === 'AVAILABLE'
      // )
      // services: activeServices,
      // }
    },

    // TODO: search the most nearest points to user location
    sortPointsByDistance() {
      const compareByDistance = (a, b) => a.distance - b.distance
      this.banksList.sort(compareByDistance)
    },

    defaultSearch(items, search, filter) {
      return (
        this.searchByPointName(items, search, filter) ||
        this.searchByAddress(items, search, filter)
      )
    },

    searchByPointName(items, search, filter) {
      const searchQuery = search.toString().toLowerCase()
      const salePointNameLowerCase = filter.salePointName.toLowerCase()
      const words = salePointNameLowerCase.split(' ')
      for (const w of words) {
        if (w.startsWith(searchQuery)) {
          return filter
        }
      }

      if (salePointNameLowerCase.includes(searchQuery)) {
        return filter
      }
    },

    searchByAddress(items, search, filter) {
      const searchQuery = search.toString().toLowerCase()
      const addressLowerCase = filter.address.toLowerCase()
      const words = addressLowerCase.split(' ')
      for (const w of words) {
        if (w.startsWith(searchQuery)) {
          return filter
        }
      }

      if (addressLowerCase.includes(searchQuery)) {
        return filter
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

.view {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

