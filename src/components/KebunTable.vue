<!-- src/components/KebunTable.vue -->
<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">Ringkasan Kebun</h3>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Kebun</th>
            <th>Luas Paket (ha)</th>
            <th>Total LC</th>
            <th>Progress Rata-rata</th>
            <th>Hari Kerja</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="kebun in kebunData" :key="kebun.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ kebun.nama }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ kebun.totalLuasPaket.toFixed(2) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ kebun.totalLC.realisasi.toFixed(2) }} / {{ kebun.totalLC.rencana.toFixed(2) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ avgProgress(kebun).toFixed(1) }}%</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ kebun.jumlahHariKerja }}</div>
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
  name: 'KebunTable',
  components: {
    Card
  },
  props: {
    kebunData: Array
  },
  methods: {
    avgProgress(kebun) {
      const activities = [
        kebun.ripper.persentase,
        kebun.luku.persentase,
        kebun.tumbangChipping.persentase,
        kebun.pembuatanParit.persentase,
        kebun.menanamMucuna.persentase,
        kebun.lubangTanam.persentase,
        kebun.menanamKS.persentase
      ];
      
      const validActivities = activities.filter(p => !isNaN(p) && p !== null);
      if (validActivities.length === 0) return 0;
      
      const sum = validActivities.reduce((a, b) => a + b, 0);
      return sum / validActivities.length;
    }
  }
}
</script>