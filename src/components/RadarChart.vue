<!-- src/components/RadarChart.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="card-body">
      <!-- Tampilkan pesan jika tidak ada data -->
      <div v-if="!charts || charts.length === 0" class="text-center py-10 text-gray-500">
        Tidak ada data untuk ditampilkan.
      </div>
      <div v-else class="radar-charts-outer">
        <div class="radar-charts-grid">
          <div v-for="(chart, index) in charts" :key="index" class="radar-chart-wrapper">
            <div class="chart-title">{{ chart.title }}</div>
            <div class="chart-container">
              <canvas :ref="el => setChartCanvas(el, index)"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'RadarChart',
  props: {
    title: String,
    charts: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    const chartCanvases = ref([]);
    const chartInstances = ref([]);
    let tooltipEl = null;

    // Fungsi helper untuk format angka
    const formatNumber = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseFloat(num).toLocaleString('id-ID');
    };

    const setChartCanvas = (el, index) => {
      if (el) {
        chartCanvases.value[index] = el;
      }
    };

    const createCustomTooltip = () => {
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<div class="tooltip-content"></div>';
        tooltipEl.style.opacity = 0;
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transition = 'opacity 0.3s';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltipEl.style.color = 'white';
        tooltipEl.style.borderRadius = '6px';
        tooltipEl.style.padding = '12px';
        tooltipEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        tooltipEl.style.maxWidth = '350px';
        tooltipEl.style.zIndex = '1000';
        
        const style = document.createElement('style');
        style.innerHTML = `
          #chartjs-tooltip .tooltip-content {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }
          #chartjs-tooltip .tooltip-header {
            font-weight: 600;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          #chartjs-tooltip .tooltip-items {
            margin-top: 8px;
          }
          #chartjs-tooltip .tooltip-item {
            margin: 4px 0;
            font-size: 0.875rem;
            display: flex;
            align-items: flex-start;
          }
          #chartjs-tooltip .tooltip-item-number {
            min-width: 20px;
            margin-right: 8px;
            font-weight: 500;
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(tooltipEl);
      }
      return tooltipEl;
    };

    const renderChart = (index) => {
      const canvas = chartCanvases.value[index];
      if (!canvas) return;
      
      if (chartInstances.value[index]) {
        chartInstances.value[index].destroy();
      }
      
      const ctx = canvas.getContext('2d');
      const chartData = props.charts[index];
      
      if (!chartData) return;
      
      // Ambil detailInfo dari dataset
      const detailInfo = chartData.data.datasets[0]?.detailInfo || [];
      
      const colors = [
        'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)', 'rgba(83, 102, 255, 0.7)', 'rgba(40, 159, 64, 0.7)'
      ];
      
      const dataset = {
        ...chartData.data.datasets[0],
        backgroundColor: colors.map(color => color.replace('0.7', '0.2')),
        borderColor: colors,
        pointBackgroundColor: colors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors
      };
      
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false, // Nonaktifkan tooltip default
            external: function(context) {
              const tooltip = createCustomTooltip();
              
              if (context.tooltip.opacity === 0) {
                tooltip.style.opacity = 0;
                return;
              }
              
              const position = context.chart.canvas.getBoundingClientRect();
              tooltip.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
              tooltip.style.top = position.top + window.pageYOffset + context.tooltip.caretY + 'px';
              
              if (context.tooltip.body) {
                const dataPoint = context.tooltip.dataPoints[0];
                const dataIndex = dataPoint.dataIndex;
                const label = dataPoint.label;
                const value = dataPoint.raw;
                
                // AMBIL DATA DETAIL UNTUK TOOLTIP
                const details = detailInfo[dataIndex];
                const { rencana, realisasi } = details || { rencana: 0, realisasi: 0 };
                
                // Format konten tooltip yang baru
                let innerHtml = `
                  <div class="tooltip-header">
                    ${chartData.title} - ${label}
                  </div>
                  <div class="tooltip-items">
                    <div class="tooltip-item">
                      <span class="tooltip-item-number">•</span>
                      <span>Realisasi: ${formatNumber(realisasi)}</span>
                    </div>
                    <div class="tooltip-item">
                      <span class="tooltip-item-number">•</span>
                      <span>Rencana: ${formatNumber(rencana)}</span>
                    </div>
                    <div class="tooltip-item" style="font-weight: 600; margin-top: 4px;">
                      <span class="tooltip-item-number">•</span>
                      <span>Progress: ${value.toFixed(1)}%</span>
                    </div>
                  </div>
                `;
                
                tooltip.querySelector('.tooltip-content').innerHTML = innerHtml;
              }
              
              tooltip.style.opacity = 1;
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const label = chartData.data.labels[index];
            const value = chartData.data.datasets[0].data[index];
            const details = detailInfo[index];
            const { rencana, realisasi } = details || { rencana: 0, realisasi: 0 };
            
            const detailText = `${chartData.title} - ${label}\n\nRealisasi: ${formatNumber(realisasi)}\nRencana: ${formatNumber(rencana)}\nProgress: ${value.toFixed(1)}%`;
            alert(detailText);
          }
        },
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      };
      
      if (chartData.options) {
        if (chartData.options.scales?.r) {
          options.scales.r = { ...options.scales.r, ...chartData.options.scales.r };
        }
      }
      
      chartInstances.value[index] = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: chartData.data.labels,
          datasets: [dataset]
        },
        options: options
      });
    };

    const renderAllCharts = () => {
      if (props.charts && Array.isArray(props.charts) && props.charts.length > 0) {
        props.charts.forEach((_, index) => {
          renderChart(index);
        });
      }
    };

    const delayedRender = () => {
      nextTick(() => {
        renderAllCharts();
      });
    };

    onMounted(() => {
      delayedRender();
    });

    watch(() => props.charts, (newCharts) => {
      if (newCharts && Array.isArray(newCharts)) {
        delayedRender();
      }
    }, { deep: true });

    onBeforeUnmount(() => {
      chartInstances.value.forEach(instance => {
        if (instance) {
          instance.destroy();
        }
      });
      if (tooltipEl) {
        tooltipEl.remove();
      }
    });

    return {
      setChartCanvas
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

/* Style untuk radar charts dengan overflow horizontal */
.radar-charts-outer {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.radar-charts-grid {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 20px;
  min-width: max-content;
}

.radar-chart-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  flex: 0 0 auto;
  /* Perlebar card agar teks lebih terbaca */
  width: 400px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Perbesar ukuran font judul agar lebih mudah dibaca */
  font-size: 16px;
  padding: 8px 0;
}

.chart-container {
  position: relative;
  height: 250px;
}

/* Scrollbar styling */
.radar-charts-outer::-webkit-scrollbar {
  height: 8px;
}

.radar-charts-outer::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.radar-charts-outer::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.radar-charts-outer::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .radar-chart-wrapper {
    width: 350px;
  }
  
  .chart-container {
    height: 220px;
  }
  
  .chart-title {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .radar-chart-wrapper {
    width: 300px;
  }
  
  .chart-container {
    height: 200px;
  }
  
  .chart-title {
    font-size: 12px;
  }
}
</style>