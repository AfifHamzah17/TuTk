<!-- src/components/ProgressBar.vue -->
<template>
  <div>
    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">{{ title }}</span>
      <span class="text-sm font-medium text-gray-700">{{ percentage.toFixed(1) }}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>Rencana: {{ rencana }}</span>
      <span>Realisasi: {{ realisasi }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    title: String,
    rencana: Number,
    realisasi: Number,
    percentage: Number
  }
}
</script>