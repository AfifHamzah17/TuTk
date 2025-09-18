<!-- src/components/ProgressCard.vue -->
<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <ProgressBar
        v-for="(item, index) in items"
        :key="index"
        :title="item.nama"
        :rencana="item.rencana"
        :realisasi="item.sdHariIni"
        :percentage="item.persentase"
      />
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';
import ProgressBar from './ProgressBar.vue';

export default {
  name: 'ProgressCard',
  components: {
    Card,
    ProgressBar
  },
  props: {
    title: String,
    items: Array
  }
}
</script>