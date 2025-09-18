<!-- src/components/SummaryCard.vue -->
<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-sm text-green-800">Rencana</p>
        <p class="text-2xl font-bold text-green-700">{{ rencana }}</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm text-blue-800">Realisasi</p>
        <p class="text-2xl font-bold text-blue-700">{{ realisasi }}</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg col-span-2">
        <div class="flex justify-between items-center">
          <p class="text-sm text-purple-800">Persentase</p>
          <p class="text-2xl font-bold text-purple-700">{{ percentage.toFixed(1) }}%</p>
        </div>
        <div class="progress-bar mt-2">
          <div 
            class="progress-fill bg-purple-600" 
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'SummaryCard',
  components: {
    Card
  },
  props: {
    title: String,
    rencana: Number,
    realisasi: Number,
    percentage: Number
  }
}
</script>