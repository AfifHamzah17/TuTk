<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else-if="rankingData.length === 0" class="text-center py-4 text-gray-500">
      Tidak ada data ranking tersedia
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Peringkat
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ entityLabel }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress Kemarin
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress Hari Ini
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Peningkatan
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tren
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in rankingData" :key="item.id" :class="index < 3 ? 'bg-yellow-50' : ''">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg font-bold" :class="getRankClass(index)">
                  {{ index + 1 }}
                </span>
                <span v-if="index < 3" class="ml-2">
                  {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatPercentage(item.yesterdayProgress) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatPercentage(item.todayProgress) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium" :class="item.change >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.change >= 0 ? '+' : '' }}{{ formatPercentage(item.change) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <svg v-if="item.change > 0" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else-if="item.change < 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span v-else class="w-5 h-5 flex items-center justify-center text-gray-400">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="mt-4 text-sm text-gray-500">
      <p>Ranking diperbarui: {{ lastUpdated }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyRanking',
  props: {
    title: {
      type: String,
      default: 'Ranking Harian'
    },
    rankingData: {
      type: Array,
      default: () => []
    },
    entityLabel: {
      type: String,
      default: 'Entity'
    },
    loading: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: String,
      default: ''
    }
  },
  methods: {
    formatPercentage(value) {
      if (value === null || value === undefined || isNaN(value)) return '0%';
      return `${parseFloat(value).toFixed(1)}%`;
    },
    getRankClass(index) {
      if (index === 0) return 'text-yellow-500';
      if (index === 1) return 'text-gray-400';
      if (index === 2) return 'text-orange-600';
      return 'text-gray-700';
    }
  }
}
</script>