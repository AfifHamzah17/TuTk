<template>
  <Card>
    <h3 class="text-lg font-semibold mb-4">Total LC (Rencana vs Realisasi)</h3>
    <div class="h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  components: { Card },
  props: {
    kebunData: Array
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      
      const labels = this.kebunData.map(kebun => kebun.kebun);
      const rencanaData = this.kebunData.map(kebun => 
        kebun.totalLC.rencana.reduce((a, b) => a + b, 0)
      );
      const realisasiData = this.kebunData.map(kebun => 
        kebun.totalLC.realisasi.reduce((a, b) => a + b, 0)
      );
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Rencana',
              data: rencanaData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Realisasi',
              data: realisasiData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
</script>