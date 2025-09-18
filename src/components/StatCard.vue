<!-- src/components/StatCard.vue -->
<template>
  <div class="stat-card">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="iconClasses" class="rounded-lg p-3">
          <svg :class="iconSize" class="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"></path>
          </svg>
        </div>
      </div>
      <div class="ml-4">
        <p class="stat-card-label">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="stat-card-value">{{ value }}</p>
          <p v-if="change" :class="changeClasses" class="ml-2 stat-card-change">
            {{ change }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: String,
    value: [String, Number],
    change: String,
    changeType: {
      type: String,
      default: 'positive',
      validator: value => ['positive', 'negative'].includes(value)
    },
    iconColor: {
      type: String,
      default: 'bg-green-500'
    },
    iconPath: String,
    iconSize: {
      type: String,
      default: 'h-6 w-6'
    }
  },
  computed: {
    iconClasses() {
      return this.iconColor;
    },
    changeClasses() {
      return this.changeType === 'positive' 
        ? 'stat-card-change-positive' 
        : 'stat-card-change-negative';
    }
  }
}
</script>