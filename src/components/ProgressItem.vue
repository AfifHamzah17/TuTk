<!-- src/components/ProgressItem.vue -->
<template>
  <div class="sub-grid">
    <div class="sub-grid-title">{{ title }} ({{ unit }})</div>
    <div class="sub-grid-cols">
      <div>
        <div class="sub-grid-label">Rencana</div>
        <div class="sub-grid-value">{{ formatNumber(rencana) }}</div>
      </div>
      <div>
        <div class="sub-grid-label">Hari Ini</div>
        <div class="sub-grid-value">{{ formatNumber(hariIni) }}</div>
      </div>
      <div>
        <div class="sub-grid-label">Sd. Hari Ini</div>
        <div class="sub-grid-value">{{ formatNumber(sdHariIni) }}</div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-info">
        <span class="progress-label">Progress</span>
        <span class="progress-value">{{ formatPercentage(persentase) }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :class="getProgressColorClass(persentase)"
          :style="{ width: `${persentase}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressItem',
  props: {
    title: String,
    unit: {
      type: String,
      default: 'ha'
    },
    rencana: {
      type: Number,
      default: 0
    },
    hariIni: {
      type: Number,
      default: 0
    },
    sdHariIni: {
      type: Number,
      default: 0
    },
    persentase: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatNumber(num) {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseFloat(num).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatPercentage(num) {
      if (num === null || num === undefined || isNaN(num)) return '0%';
      return `${parseFloat(num).toFixed(1)}%`;
    },
    getProgressColorClass(percentage) {
      if (percentage >= 80) return 'progress-fill-success';
      if (percentage >= 50) return 'progress-fill-warning';
      return 'progress-fill-danger';
    }
  }
}
</script>

<style scoped>
.sub-grid {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.sub-grid-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.sub-grid-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.sub-grid-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.sub-grid-value {
  font-weight: 500;
  color: #1f2937;
}

.progress-container {
  margin-top: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.progress-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.progress-value {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1f2937;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill-success {
  background-color: #10b981;
}

.progress-fill-warning {
  background-color: #f59e0b;
}

.progress-fill-danger {
  background-color: #ef4444;
}
</style>