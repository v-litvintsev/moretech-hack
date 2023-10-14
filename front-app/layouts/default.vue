<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="menu"
      mobile-breakpoint="768"
      mini-variant-width="100%"
      width="100%"
      fixed
    >
      <v-container class="pb-1" style="display:flex;justify-content: flex-end;">
        <v-btn
          solo
          icon
          outlined
          rounded
          class="ml-auto mr-2"
          @click="menu=false"
        >
          <v-icon size="16">
            mdi-close
          </v-icon>
        </v-btn>
      </v-container>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-btn
      v-if="!menu"
      absolute
      icon
      solo
      right
      class="mt-3 black"
      style="z-index: 1000"
      @click="openMenu()"
    >
      <v-icon size="20">
        mdi-menu
      </v-icon>
    </v-btn>
    <v-main>
      <v-container class="pa-0">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      menu: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Главнвя',
          to: '/',
        },
      ],
    }
  },
  methods: {
    openMenu() {
      this.menu = true
    }
  },
}
</script>
