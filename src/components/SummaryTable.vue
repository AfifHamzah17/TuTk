<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">Ringkasan Kebun</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kebun</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Luas (ha)</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress Rata-rata</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total LC</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari Kerja</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="kebun in kebunData" :key="kebun.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ kebun.kebun }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ totalLuas(kebun.luasPaket) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ avgProgress(kebun) }}%</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ totalLC(kebun.totalLC) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ avgHariKerja(kebun.jumlahHariKerja) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';

export default {
  components: { Card },
  props: {
    kebunData: Array
  },
  methods: {
    totalLuas(luas) {
      return luas.reduce((a, b) => a + b, 0).toFixed(2);
    },
    avgProgress(kebun) {
      const total = kebun.ripper.persentase.reduce((a, b) => a + b, 0) +
                   kebun.luku.persentase.reduce((a, b) => a + b, 0);
      return (total / (kebun.ripper.persentase.length * 2)).toFixed(1);
    },
    totalLC(lc) {
      const rencana = lc.rencana.reduce((a, b) => a + b, 0);
      const realisasi = lc.realisasi.reduce((a, b) => a + b, 0);
      return `${realisasi.toFixed(2)}/${rencana.toFixed(2)}`;
    },
    avgHariKerja(hari) {
      return Math.round(hari.reduce((a, b) => a + b, 0) / hari.length);
    }
  }
}
</script>