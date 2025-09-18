<!-- src/components/RawDataTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RawDataTable',
  props: {
    data: Object
  },
  computed: {
    headers() {
      if (!this.data || !this.data.table || !this.data.table.cols) return [];
      return this.data.table.cols.map(col => col.label || '');
    },
    rows() {
      if (!this.data || !this.data.table || !this.data.table.rows) return [];
      return this.data.table.rows.map(row => {
        return row.c ? row.c.map(cell => cell ? cell.v || '' : '') : [];
      });
    }
  }
}
</script>