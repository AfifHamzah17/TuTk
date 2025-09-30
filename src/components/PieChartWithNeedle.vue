<!-- src/components/PieChartWithNeedle.vue -->
<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-grid-outer">
      <div class="chart-grid">
        <div v-for="(item, index) in chartItems" :key="index" class="chart-item">
          <div class="mini-chart">
            <canvas :ref="el => setChartRef(el, index)"></canvas>
            <div class="chart-info">
              <div class="chart-label">{{ item.label }}</div>
              <div class="chart-value">{{ item.value }}%</div>
              <div class="chart-degree">{{ getDegree(item.value) }}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
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
    averageProgress: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const chartRefs = ref([]);
    const chartInstances = ref([]);
    const isInitialized = ref(false);
    
    // Prepare chart items from the data
    const chartItems = computed(() => {
      if (!props.data || !props.data.labels || !props.data.datasets || !props.data.datasets[0]) {
        return [];
      }
      
      return props.data.labels.map((label, index) => ({
        label,
        value: Math.round(props.data.datasets[0].data[index] * 100) / 100
      }));
    });
    
    // Set chart reference for each canvas
    const setChartRef = (el, index) => {
      if (el) {
        chartRefs.value[index] = el;
      }
    };
    
    // Create degree lookup table for values 1-100
    const degreeLookup = [
      0,    // 0 (unused)
      0,    // 1
      3.6,  // 2
      7.2,  // 3
      10.8, // 4
      14.4, // 5
      18,   // 6
      21.6, // 7
      25.2, // 8
      28.8, // 9
      32.4, // 10
      36,   // 11
      39.6, // 12
      43.2, // 13
      46.8, // 14
      50.4, // 15
      54,   // 16
      57.6, // 17
      61.2, // 18
      64.8, // 19
      68.4, // 20
      72,   // 21
      75.6, // 22
      79.2, // 23
      82.8, // 24
      86.4, // 25
      90,   // 26
      93.6, // 27
      97.2, // 28
      100.8,// 29
      104.4,// 30
      108,  // 31
      111.6,// 32
      115.2,// 33
      118.8,// 34
      122.4,// 35
      126,  // 36
      129.6,// 37
      133.2,// 38
      136.8,// 39
      140.4,// 40
      144,  // 41
      147.6,// 42
      151.2,// 43
      154.8,// 44
      158.4,// 45
      162,  // 46
      165.6,// 47
      169.2,// 48
      172.8,// 49
      176.4,// 50
      180,  // 51
      183.6,// 52
      187.2,// 53
      190.8,// 54
      194.4,// 55
      198,  // 56
      201.6,// 57
      205.2,// 58
      208.8,// 59
      212.4,// 60
      216,  // 61
      219.6,// 62
      223.2,// 63
      226.8,// 64
      230.4,// 65
      234,  // 66
      237.6,// 67
      241.2,// 68
      244.8,// 69
      248.4,// 70
      252,  // 71
      255.6,// 72
      259.2,// 73
      262.8,// 74
      266.4,// 75
      270,  // 76
      273.6,// 77
      277.2,// 78
      280.8,// 79
      284.4,// 80
      288,  // 81
      291.6,// 82
      295.2,// 83
      298.8,// 84
      302.4,// 85
      306,  // 86
      309.6,// 87
      313.2,// 88
      316.8,// 89
      320.4,// 90
      324,  // 91
      327.6,// 92
      331.2,// 93
      334.8,// 94
      338.4,// 95
      342,  // 96
      345.6,// 97
      349.2,// 98
      352.8,// 99
      356.4 // 100
    ];
    
    // Get degree from lookup table
    const getDegree = (value) => {
      // Round to nearest integer and clamp between 1-100
      const intValue = Math.max(1, Math.min(100, Math.round(value)));
      return degreeLookup[intValue];
    };
    
    // Calculate the needle angle in radians
    // Adjust to start from top (like a clock) and rotate clockwise
    const calculateNeedleAngle = (value) => {
      const degree = getDegree(value);
      // Adjust to start from top (subtract 90 degrees)
      const adjustedDegree = degree - 90;
      // Convert degrees to radians
      return (adjustedDegree * Math.PI) / 180;
    };
    
    // Render all charts
    const renderCharts = async () => {
      // Destroy existing chart instances
      chartInstances.value.forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
      chartInstances.value = [];
      
      // Wait for DOM update
      await nextTick();
      
      // Create new chart instances
      chartRefs.value.forEach((canvas, index) => {
        if (!canvas) return;
        
        const item = chartItems.value[index];
        if (!item) return;
        
        // Check if canvas already has a chart
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
          existingChart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        
        // Define the 4 quarters with labels and colors
        const quarters = [
          { label: '76-100%', color: '#10B981' },   // Merah - Segment 1: 0°-90°
          { label: '0-25%', color: '#EF4444' },  // Kuning - Segment 2: 90°-180°
          { label: '26-50%', color: '#F59E0B' },  // Biru - Segment 3: 180°-270°
          { label: '51-75%', color: '#4F46E5' }  // Hijau - Segment 4: 270°-360°
        ];
        
        // Create pie chart data with 4 equal quarters
        const chartData = {
          labels: quarters.map(q => q.label),
          datasets: [{
            data: [25, 25, 25, 25], // Equal 25% for each quarter
            backgroundColor: quarters.map(q => q.color),
            borderColor: '#FFFFFF',
            borderWidth: 2
          }]
        };
        
        const chartInstance = new Chart(ctx, {
          type: 'pie',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90, // Start from top (12 o'clock position)
            circumference: 360, // Full circle
            plugins: {
              legend: {
                display: false // Hide legend in individual charts
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    return `${label}`;
                  }
                }
              }
            }
          },
          plugins: [{
            id: 'pieNeedle',
            afterDraw: chart => {
              // Check if chart context is available
              if (!chart || !chart.ctx || !chart.chartArea) {
                return;
              }
              
              const { ctx, chartArea: { width, height } } = chart;
              const centerX = width / 2;
              const centerY = height / 2;
              const radius = Math.min(width, height) / 2.5;
              
              // Draw needle
              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate(calculateNeedleAngle(item.value));
              
              // Needle body
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(radius * 0.8, 0);
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#1F2937';
              ctx.stroke();
              
              // Needle tip
              ctx.beginPath();
              ctx.moveTo(radius * 0.8, 0);
              ctx.lineTo(radius * 0.8 - 8, -6);
              ctx.lineTo(radius * 0.8 - 8, 6);
              ctx.closePath();
              ctx.fillStyle = '#1F2937';
              ctx.fill();
              
              // Needle base
              ctx.beginPath();
              ctx.arc(0, 0, 6, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.fill();
              ctx.strokeStyle = '#1F2937';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              ctx.restore();
              
              // Draw center circle
              ctx.beginPath();
              ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
              ctx.fillStyle = '#FFFFFF';
              ctx.fill();
              ctx.strokeStyle = '#1F2937';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw quarter dividers
              for (let i = 0; i < 4; i++) {
                // Start from top (12 o'clock) and rotate clockwise
                const angle = (i * Math.PI / 2) - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                  centerX + Math.cos(angle) * radius,
                  centerY + Math.sin(angle) * radius
                );
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
              }
              
              // Draw degree labels at each quarter boundary
              ctx.font = '10px Arial';
              ctx.fillStyle = '#1F2937';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // 0° (top)
              ctx.fillText('0%', centerX, centerY - radius - 15);
              // 90° (right)
              ctx.fillText('25%', centerX + radius + 15, centerY);
              // 180° (bottom)
              ctx.fillText('50%', centerX, centerY + radius + 15);
              // 270° (left)
              ctx.fillText('75%', centerX - radius - 15, centerY);
            }
          }]
        });
        
        chartInstances.value[index] = chartInstance;
      });
    };
    
    // Initialize chart refs array
    const initChartRefs = () => {
      chartRefs.value = new Array(chartItems.value.length).fill(null);
    };
    
    onMounted(() => {
      initChartRefs();
      isInitialized.value = true;
      renderCharts();
    });
    
    onBeforeUnmount(() => {
      // Clean up chart instances
      chartInstances.value.forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
    });
    
    watch(() => props.data, () => {
      if (isInitialized.value) {
        initChartRefs();
        renderCharts();
      }
    }, { deep: true });
    
    watch(() => props.averageProgress, () => {
      if (isInitialized.value) {
        renderCharts();
      }
    });
    
    return {
      chartItems,
      setChartRef,
      getDegree
    };
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-grid-outer {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 0.5rem; /* Space for scrollbar */
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  min-width: max-content;
}

.chart-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-chart {
  width: 100%;
  max-width: 220px;
  height: 260px;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

.mini-chart:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-info {
  margin-top: 0.75rem;
  text-align: center;
  width: 100%;
}

.chart-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.chart-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1F2937;
}

.chart-degree {
  font-size: 1rem;
  color: #6B7280;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Scrollbar styling */
.chart-grid-outer::-webkit-scrollbar {
  height: 8px;
}

.chart-grid-outer::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.chart-grid-outer::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.chart-grid-outer::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .chart-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
  
  .mini-chart {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .chart-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>