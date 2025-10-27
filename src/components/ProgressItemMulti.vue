<template>
  <div class="multi-progress">
    <div class="multi-progress-title">{{ title }} ({{ unit }})</div>
    <div class="multi-progress-grid">
      <div class="multi-progress-item">
        <div class="multi-progress-label">NPK</div>
        <div class="multi-progress-value">{{ formatNumber(npk) }}</div>
      </div>
      <div class="multi-progress-item">
        <div class="multi-progress-label">Dolomit</div>
        <div class="multi-progress-value">{{ formatNumber(dolomit) }}</div>
      </div>
      <div class="multi-progress-item">
        <div class="multi-progress-label">Urea</div>
        <div class="multi-progress-value">{{ formatNumber(urea) }}</div>
      </div>
      <div class="multi-progress-item">
        <div class="multi-progress-label">Borat</div>
        <div class="multi-progress-value">{{ formatNumber(borat) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressItemMulti',
  props: {
    title: String,
    unit: {
      type: String,
      default: 'Ton'
    },
    npk: {
      type: Number,
      default: 0
    },
    dolomit: {
      type: Number,
      default: 0
    },
    urea: {
      type: Number,
      default: 0
    },
    borat: {
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
    }
  }
}
</script>

<style scoped>
.multi-progress {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.multi-progress-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.multi-progress-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.multi-progress-item {
  padding: 0.25rem;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.multi-progress-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.multi-progress-value {
  font-weight: 500;
  color: #1f2937;
}
</style>