<!-- src/components/PieChartWithNeedle.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="card-body">
      <div class="pie-charts-outer">
                    <!-- Legend untuk setiap chart -->
            <div class="chart-legend">
              <div v-for="(legendItem, legendIndex) in legend" :key="legendIndex" class="legend-item">
                <div class="legend-color" :style="`background-color: ${legendItem.color}`"></div>
                <span>{{ legendItem.label }}</span>
              </div>
            </div>
        <div class="pie-charts-grid">
          <div v-for="(item, index) in chartItems" :key="index" class="pie-chart-wrapper">
            <div class="chart-title">{{ item.label }}</div>
            <div class="chart-container">
              <canvas :ref="el => setChartRef(el, index)"></canvas>
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
    },
    // Tambahkan prop legend
    legend: {
      type: Array,
      default: () => [
        { label: '76-100%', color: '#10B981' },
        { label: '0-25%', color: '#EF4444' },
        { label: '26-50%', color: '#F59E0B' },
        { label: '51-75%', color: '#4F46E5' }
      ]
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
0,    // 0
3.6,  // 1
7.2,  // 2
10.8, // 3
14.4, // 4
18.0, // 5
21.6, // 6
25.2, // 7
28.8, // 8
32.4, // 9
36.0, // 10
39.6, // 11
43.2, // 12
46.8, // 13
50.4, // 14
54.0, // 15
57.6, // 16
61.2, // 17
64.8, // 18
68.4, // 19
72.0, // 20
75.6, // 21
79.2, // 22
82.8, // 23
86.4, // 24
90.0, // 25
93.6, // 26
97.2, // 27
100.8,// 28
104.4,// 29
108.0,// 30
111.6,// 31
115.2,// 32
118.8,// 33
122.4,// 34
126.0,// 35
129.6,// 36
133.2,// 37
136.8,// 38
140.4,// 39
144.0,// 40
147.6,// 41
151.2,// 42
154.8,// 43
158.4,// 44
162.0,// 45
165.6,// 46
169.2,// 47
172.8,// 48
176.4,// 49
180.0,// 50
183.6,// 51
187.2,// 52
190.8,// 53
194.4,// 54
198.0,// 55
201.6,// 56
205.2,// 57
208.8,// 58
212.4,// 59
216.0,// 60
219.6,// 61
223.2,// 62
226.8,// 63
230.4,// 64
234.0,// 65
237.6,// 66
241.2,// 67
244.8,// 68
248.4,// 69
252.0,// 70
255.6,// 71
259.2,// 72
262.8,// 73
266.4,// 74
270.0,// 75
273.6,// 76
277.2,// 77
280.8,// 78
284.4,// 79
288.0,// 80
291.6,// 81
295.2,// 82
298.8,// 83
302.4,// 84
306.0,// 85
309.6,// 86
313.2,// 87
316.8,// 88
320.4,// 89
324.0,// 90
327.6,// 91
331.2,// 92
334.8,// 93
338.4,// 94
342.0,// 95
345.6,// 96
349.2,// 97
352.8,// 98
356.4,// 99
360.0 // 100 (full circle)
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
                enabled: false // Nonaktifkan tooltip
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
              
              // Draw percentage labels at each quarter boundary (outside the pie)
              ctx.font = 'bold 12px Arial';
              ctx.fillStyle = '#1F2937';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Draw percentage value at needle tip
              if (item.value !== undefined && item.value !== null) {
                const degree = getDegree(item.value);
                // Adjust to start from top (subtract 90 degrees)
                const adjustedDegree = degree - 90;
                // Convert degrees to radians
                const angleInRadians = (adjustedDegree * Math.PI) / 180;
                
                // Calculate position at needle tip
                const needleTipX = centerX + Math.cos(angleInRadians) * radius * 1;
                const needleTipY = centerY + Math.sin(angleInRadians) * radius * 1;
                
                // Draw background for percentage text
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Measure text width for background
                const text = `${item.value}%`;
                const textWidth = ctx.measureText(text).width;
                
                // Draw background rectangle
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(
                  needleTipX - textWidth / 2 - 4,
                  needleTipY - 10,
                  textWidth + 8,
                  20
                );
                
                // Draw border
                ctx.strokeStyle = '#1F2937';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                  needleTipX - textWidth / 2 - 4,
                  needleTipY - 10,
                  textWidth + 8,
                  20
                );
                
                // Draw text
                ctx.fillStyle = '#1F2937';
                ctx.fillText(text, needleTipX, needleTipY);
              }
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

/* Style untuk pie charts dengan overflow horizontal */
.pie-charts-outer {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.pie-charts-grid {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 20px;
  min-width: max-content;
}

.pie-chart-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  flex: 0 0 auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* PERUBAHAN: Memperbaiki chart title agar bisa multi-line */
.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
  /* Mengizinkan pembungkusan teks */
  white-space: normal;
  /* Menentukan maksimal tinggi untuk title */
  max-height: 40px;
  /* Mengatur overflow */
  overflow: hidden;
  /* Mengatur line height untuk konsistensi */
  line-height: 1.2;
  /* Menentukan jumlah maksimal baris */
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.chart-info {
  margin-top: 10px;
  text-align: center;
  width: 100%;
}

.chart-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1F2937;
}

/* Style untuk legend */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  gap: 8px;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 4px;
}

/* Scrollbar styling */
.pie-charts-outer::-webkit-scrollbar {
  height: 8px;
}

.pie-charts-outer::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.pie-charts-outer::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.pie-charts-outer::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .pie-chart-wrapper {
    width: 250px;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style>