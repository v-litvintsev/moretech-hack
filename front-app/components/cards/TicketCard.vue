<template>
  <div>
    <v-card
      flat
      class="lighten-3 rounded-card pa-4"
      color="white"
      style="border: 1px solid black !important"
      outlined
      height="140"
    >
      <div class="black--text">
        <h2>Принятая заявка #{{ numberInQueue }}</h2>
        <div>{{ numberOfPoints }} точек / {{ distance }} км</div>
        <div>{{ type }}</div>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'TicketCard',
  props: {
    numberInQueue: Number(),
    numberOfPoints: Number(),
    distance: Number(),
    type: String(),
  },
  data() {
    return {}
  },
}
</script>
<style>
.card-border.v-sheet.v-card {
  border-width: 2px;
}

.rounded-card.v-sheet.v-card {
  border-radius: 1rem;
}
</style>
