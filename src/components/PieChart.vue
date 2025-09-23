<!-- src/components/PieChart.vue -->
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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'PieChart',
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
    let tooltipEl = null;

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

    const renderChart = () => {
      if (!chartCanvas.value) return;
      
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      const ctx = chartCanvas.value.getContext('2d');
      
      // Ambil detail info dari data
      const detailInfo = props.data.datasets[0]?.detailInfo || [];
      
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
                }
              }
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
                      ${label}: ${value} item
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
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const label = props.data.labels[index];
              const value = props.data.datasets[0].data[index];
              const details = detailInfo[index] || '';
              
              // Tampilkan detail dalam modal atau alert
              let detailText = `${label}: ${value} item\n\n`;
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

    onMounted(() => {
      renderChart();
    });

    watch(() => props.data, () => {
      renderChart();
    }, { deep: true });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (tooltipEl) {
        tooltipEl.remove();
      }
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