<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProgressChart 
        title="Progress Ripper" 
        :data="selectedKebun.ripper" 
        :afd="selectedKebun.afd" 
      />
      <ProgressChart 
        title="Progress Luku" 
        :data="selectedKebun.luku" 
        :afd="selectedKebun.afd" 
      />
      <!-- Tambahkan progress chart untuk pekerjaan lainnya -->
    </div>
    
    <Card>
      <h3 class="text-lg font-semibold mb-4">Detail Total LC</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AFD</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rencana</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realisasi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal SPPBJ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari Kerja</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(afd, index) in selectedKebun.afd" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ afd }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ selectedKebun.totalLC.rencana[index] }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ selectedKebun.totalLC.realisasi[index] }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ selectedKebun.totalLC.persentase[index] }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(selectedKebun.tanggalSPPBJ[index]) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ selectedKebun.jumlahHariKerja[index] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from './Card.vue';
import ProgressChart from './ProgressChart.vue';

export default {
  components: { Card, ProgressChart },
  props: {
    selectedKebun: Object
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
}
</script>