<!-- src/components/PieChartWithNeedle.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="card-body">
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'PieChartWithNeedle',
  props: {
    title: String,
    data: {
      type: Object,
      required: true
    },
    // The average progress value to point the needle to
    averageProgress: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Calculate the needle position based on the average progress
    const needleAngle = computed(() => {
      // Convert percentage to radians (0-100% -> 0-2π radians)
      return (props.averageProgress / 100) * Math.PI * 2;
    });

    const renderChart = () => {
      if (!chartCanvas.value) return;
      
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const ctx = chartCanvas.value.getContext('2d');
      
      // Create pie chart with needle
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                font: {
                  size: 12
                },
                // Limit the number of items in the legend to avoid overflow
                generateLabels: function(chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    const { labels } = data;
                    const dataset = data.datasets[0];
                    const values = dataset.data;
                    
                    // Only show labels for items with value > 0
                    return labels.map((label, i) => {
                      const value = values[i];
                      if (value > 0) {
                        return {
                          text: `${label}: ${value.toFixed(1)}%`,
                          fillStyle: dataset.backgroundColor[i],
                          strokeStyle: dataset.borderColor[i],
                          lineWidth: dataset.borderWidth,
                          hidden: false,
                          index: i
                        };
                      }
                      return null;
                    }).filter(Boolean);
                  }
                  return [];
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value.toFixed(1)}%`;
                }
              }
            }
          }
        },
        plugins: [{
          id: 'pieNeedle',
          afterDraw: chart => {
            const { ctx, chartArea: { width, height } } = chart;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2.5;
            
            // Draw needle
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(needleAngle.value);
            
            // Needle body
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius, 0);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#1F2937';
            ctx.stroke();
            
            // Needle tip
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(radius - 8, -6);
            ctx.lineTo(radius - 8, 6);
            ctx.closePath();
            ctx.fillStyle = '#1F2937';
            ctx.fill();
            
            // Needle base
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#1F2937';
            ctx.fill();
            
            ctx.restore();
            
            // Draw center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#1F2937';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw average progress text
            ctx.fillStyle = '#1F2937';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${props.averageProgress.toFixed(1)}%`, centerX, centerY);
          }
        }]
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch(() => props.data, () => {
      renderChart();
    }, { deep: true });

    watch(() => props.averageProgress, () => {
      renderChart();
    });

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
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-body {
  padding: 1.5rem;
}

.chart-container {
  position: relative;
  height: 300px;
}
</style>