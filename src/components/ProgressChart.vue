<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(item, index) in data" :key="index" class="mb-2">
        <div class="flex justify-between mb-1">
          <span class="text-sm font-medium">{{ afd[index] }}</span>
          <span class="text-sm font-medium">{{ item.persentase }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-green-600 h-2.5 rounded-full" 
            :style="{ width: `${item.persentase}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Rencana: {{ item.rencana }}</span>
          <span>Realisasi: {{ item.sdHariIni }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';

export default {
  components: { Card },
  props: {
    title: String,
    data: Array,
    afd: Array
  }
}
</script>