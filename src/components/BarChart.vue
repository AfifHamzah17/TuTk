<!-- src/components/BarChart.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="card-body">
      <div class="chart-container" >
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'BarChart',
  props: {
    title: String,
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (!chartCanvas.value) return;
      
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const ctx = chartCanvas.value.getContext('2d');
      
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                // Tampilkan semua item tanpa batasan
                boxWidth: 15,
                padding: 15,
                usePointStyle: true,
                pointStyle: 'rectRounded',
                font: {
                  size: 11
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          // Gunakan options dari props jika ada
          ...(props.data.options || {})
        }
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch(() => props.data, () => {
      renderChart();
    }, { deep: true });

    return {
      chartCanvas
    };
  }
}
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-body {
  padding: 1rem;
}

.chart-container {
  position: relative;
  height: 300px;
}
</style>