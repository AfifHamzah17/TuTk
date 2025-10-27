// src/utils/dateUtils.js

/**
 * Menghitung selisih hari antara dua tanggal
 * @param {string} dateString - Tanggal dalam format M/D/YYYY atau MM/DD/YYYY
 * @returns {number} - Jumlah hari selisih
 */
export const calculateDaysDifference = (dateString) => {
  if (!dateString) return 0;
  
  try {
    // Parse tanggal dari format M/D/YYYY atau MM/DD/YYYY
    const parts = dateString.split('/');
    if (parts.length !== 3) return 0;
    
    // Format M/D/YYYY atau MM/DD/YYYY
    const month = parseInt(parts[0], 10) - 1; // Bulan dimulai dari 0 (Januari=0)
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Validasi komponen tanggal
    if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
    
    const date = new Date(year, month, day);
    const today = new Date();
    
    // Reset time untuk perbandingan yang akurat
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Hitung selisih waktu dalam milidetik
    const diffTime = today - date;
    
    // Konversi ke hari
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Jika hasilnya negatif (tanggal di masa depan), kembalikan 0
    return diffDays < 0 ? 0 : diffDays;
  } catch (error) {
    console.error('Error calculating days difference:', error);
    return 0;
  }
};

/**
 * Menghitung selisih hari antara tanggal yang diberikan dengan hari ini
 * dengan menampilkan tanda (+) untuk tanggal di masa depan dan (-) untuk tanggal yang sudah lewat
 * @param {string} dateString - Tanggal dalam format M/D/YYYY atau MM/DD/YYYY
 * @returns {string} - Selisih hari dengan tanda (+) atau (-)
 */
export const calculateDaysDifferenceWithSign = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // Parse tanggal dari format M/D/YYYY atau MM/DD/YYYY
    const parts = dateString.split('/');
    if (parts.length !== 3) return '-';
    
    // Format M/D/YYYY atau MM/DD/YYYY
    const month = parseInt(parts[0], 10) - 1; // Bulan dimulai dari 0 (Januari=0)
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Validasi komponen tanggal
    if (isNaN(day) || isNaN(month) || isNaN(year)) return '-';
    
    const date = new Date(year, month, day);
    const today = new Date();
    
    // Reset time untuk perbandingan yang akurat
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Hitung selisih waktu dalam milidetik
    const diffTime = today - date;
    
    // Konversi ke hari
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Jika hasilnya negatif (tanggal di masa depan), tambahkan tanda +
    if (diffDays < 0) {
      return `+${Math.abs(diffDays)} hari`;
    } else {
      // Jika hasilnya positif atau nol (tanggal sudah lewat atau hari ini), tambahkan tanda -
      return `-${diffDays} hari`;
    }
  } catch (error) {
    console.error('Error calculating days difference with sign:', error);
    return '-';
  }
};

/**
 * Format tanggal dari M/D/YYYY atau MM/DD/YYYY ke format yang lebih mudah dibaca
 * @param {string} dateString - Tanggal dalam format M/D/YYYY atau MM/DD/YYYY
 * @returns {string} - Tanggal yang diformat
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString;
    
    // Format M/D/YYYY atau MM/DD/YYYY
    const month = parseInt(parts[0], 10) - 1; // Bulan dimulai dari 0
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Validasi komponen tanggal
    if (isNaN(day) || isNaN(month) || isNaN(year)) return dateString;
    
    const date = new Date(year, month, day);
    
    // Format tanggal menjadi DD MMM YYYY (contoh: 9 Sep 2025)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Validasi format tanggal M/D/YYYY atau MM/DD/YYYY
 * @param {string} dateString - String tanggal yang akan divalidasi
 * @returns {boolean} - True jika format valid
 */
export const isValidDateFormat = (dateString) => {
  if (!dateString) return false;
  
  // Update regex untuk menerima satu atau dua digit untuk bulan dan hari
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;
  
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  // Validasi rentang nilai
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  
  return true;
};