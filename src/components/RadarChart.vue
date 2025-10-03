<!-- src/components/RadarChart.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="card-body">
      <div class="radar-charts-outer">
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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'RadarChart',
  props: {
    title: String,
    charts: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartCanvases = ref([]);
    const chartInstances = ref([]);
    let tooltipEl = null;

    const setChartCanvas = (el, index) => {
      if (el) {
        chartCanvases.value[index] = el;
      }
    };

    const createCustomTooltip = () => {
      // Buat elemen tooltip jika belum ada
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
        
        // Tambahkan style untuk konten tooltip
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
      
      // Hancurkan chart instance yang sudah ada jika ada
      if (chartInstances.value[index]) {
        chartInstances.value[index].destroy();
      }
      
      const ctx = canvas.getContext('2d');
      const chartData = props.charts[index];
      
      // Pastikan chartData ada
      if (!chartData) return;
      
      // Ambil detail info dari data
      const detailInfo = chartData.data.datasets[0]?.detailInfo || [];
      
      // Palet warna yang cantik untuk setiap item
      const colors = [
        'rgba(255, 99, 132, 0.7)',   // Merah - Pembuatan Parit
        'rgba(54, 162, 235, 0.7)',   // Biru - Pembuatan Jalan
        'rgba(255, 206, 86, 0.7)',   // Kuning - Pembuatan Teras
        'rgba(75, 192, 192, 0.7)',   // Cyan - Ripping
        'rgba(153, 102, 255, 0.7)',  // Ungu - Luku
        'rgba(255, 159, 64, 0.7)',   // Oranye - Tumbang/Chipping
        'rgba(199, 199, 199, 0.7)',  // Abu-abu - Menanam Mucuna
        'rgba(83, 102, 255, 0.7)',   // Biru Tua - Lubang Tanam KS
        'rgba(40, 159, 64, 0.7)'    // Hijau Tua - Menanam KS
      ];
      
      // Buat dataset dengan warna yang berbeda untuk setiap item
      const dataset = {
        label: 'Progress (%)',
        data: chartData.data.datasets[0].data,
        backgroundColor: colors.map(color => color.replace('0.7', '0.2')),
        borderColor: colors,
        pointBackgroundColor: colors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors
      };
      
      chartInstances.value[index] = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: chartData.data.labels,
          datasets: [dataset]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Sembunyikan legenda
            },
            tooltip: {
              enabled: false, // Nonaktifkan tooltip default
              external: function(context) {
                // Buat atau dapatkan elemen tooltip
                const tooltip = createCustomTooltip();
                
                // Sembunyikan jika tidak ada tooltip
                if (context.tooltip.opacity === 0) {
                  tooltip.style.opacity = 0;
                  return;
                }
                
                // Set posisi tooltip
                const position = context.chart.canvas.getBoundingClientRect();
                tooltip.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
                tooltip.style.top = position.top + window.pageYOffset + context.tooltip.caretY + 'px';
                
                // Set konten tooltip
                if (context.tooltip.body) {
                  const dataPoint = context.tooltip.dataPoints[0];
                  const dataIndex = dataPoint.dataIndex;
                  const label = dataPoint.label;
                  const value = dataPoint.raw;
                  
                  // Ambil detail info untuk data ini
                  const details = detailInfo[dataIndex] || '';
                  
                  // Format konten tooltip
                  let innerHtml = `
                    <div class="tooltip-header">
                      ${chartData.title} - ${label}: ${value.toFixed(1)}%
                    </div>
                    <div class="tooltip-items">
                  `;
                  
                  // Tambahkan detail item
                  if (details) {
                    const items = details.split('<br>');
                    items.forEach((item, index) => {
                      if (item.trim()) {
                        innerHtml += `
                          <div class="tooltip-item">
                            <span class="tooltip-item-number">${index + 1}.</span>
                            <span>${item.trim()}</span>
                          </div>
                        `;
                      }
                    });
                  } else {
                    innerHtml += '<div class="tooltip-item">Tidak ada detail</div>';
                  }
                  
                  innerHtml += '</div>';
                  
                  tooltip.querySelector('.tooltip-content').innerHTML = innerHtml;
                }
                
                // Tampilkan tooltip
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
              const details = detailInfo[index] || '';
              
              // Tampilkan detail dalam modal atau alert
              let detailText = `${chartData.title} - ${label}: ${value.toFixed(1)}%\n\n`;
              if (details) {
                const items = details.split('<br>');
                items.forEach((item, i) => {
                  if (item.trim()) {
                    detailText += `${i + 1}. ${item.trim()}\n`;
                  }
                });
              }
              
              // Gunakan alert untuk sederhananya
              alert(detailText);
            }
          },
          onHover: (event, elements) => {
            event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
          }
        }
      });
    };

    const renderAllCharts = () => {
      // Pastikan props.charts ada dan merupakan array
      if (props.charts && Array.isArray(props.charts) && props.charts.length > 0) {
        // Render semua chart
        props.charts.forEach((_, index) => {
          renderChart(index);
        });
      }
    };

    onMounted(() => {
      renderAllCharts();
    });

    watch(() => props.charts, (newCharts) => {
      // Pastikan newCharts ada sebelum render
      if (newCharts && Array.isArray(newCharts)) {
        renderAllCharts();
      }
    }, { deep: true });

    onBeforeUnmount(() => {
      // Hancurkan semua chart instance
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