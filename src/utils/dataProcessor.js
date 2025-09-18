// src/utils/dataProcessor.js
import { format, parseISO, differenceInDays } from 'date-fns';

export const processSheetData = (rawData) => {
  const table = rawData.table;
  const rows = table.rows;
  
  // Struktur data yang akan kita hasilkan
  const result = {
    kebun: [],
    total: {}
  };
  
  let currentKebun = null;
  let currentAfd = [];
  
  // Fungsi untuk menghitung persentase
  const calculatePercentage = (realisasi, rencana) => {
    if (!rencana || rencana === 0) return 0;
    return (realisasi / rencana) * 100;
  };
  
  // Fungsi untuk menghitung selisih hari
  const calculateDaysDifference = (dateString) => {
    if (!dateString) return 0;
    
    // Parse tanggal dari format DD/MM/YYYY
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Bulan dimulai dari 0
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    const today = new Date();
    
    // Reset time untuk perbandingan yang akurat
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Proses setiap baris
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.c;
    
    // Skip baris kosong
    if (!cells || cells.length === 0) continue;
    
    // Cek apakah ini baris nama kebun
    const kebunName = cells[1] ? cells[1].v : '';
    
    if (kebunName && kebunName !== 'Kebun') {
      // Simpan kebun sebelumnya jika ada
      if (currentKebun) {
        result.kebun.push(currentKebun);
      }
      
      // Mulai kebun baru
      currentKebun = {
        id: result.kebun.length + 1,
        nama: kebunName,
        afd: [],
        totalLuasPaket: 0,
        ripper: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        luku: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        tumbangChipping: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        pembuatanParit: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        menanamMucuna: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        lubangTanam: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        menanamKS: {
          rencana: 0,
          hariIni: 0,
          sdHariIni: 0,
          persentase: 0
        },
        totalLC: {
          rencana: 0,
          realisasi: 0,
          persentase: 0
        },
        tanggalSPPBJ: '',
        jumlahHariKerja: 0
      };
      
      currentAfd = [];
    }
    
    // Skip baris header
    if (kebunName === 'Kebun') continue;
    
    // Skip baris "Jumlah"
    if (cells[0] && cells[0].v === 'Jumlah') continue;
    
    // Skip baris "Total"
    if (cells[0] && cells[0].v === 'Total') continue;
    
    // Proses data AFD
    if (currentKebun) {
      // Ambil data dari sel
      const afdName = cells[2] ? cells[2].v : '';
      const luasPaket = cells[3] ? cells[3].v : 0;
      
      // Ripper
      const ripperRencana = cells[4] ? cells[4].v : 0;
      const ripperHariIni = cells[5] ? cells[5].v : 0;
      const ripperSdHariIni = cells[6] ? cells[6].v : 0;
      const ripperPersentase = calculatePercentage(ripperSdHariIni, ripperRencana);
      
      // Luku
      const lukuRencana = cells[8] ? cells[8].v : 0;
      const lukuHariIni = cells[9] ? cells[9].v : 0;
      const lukuSdHariIni = cells[10] ? cells[10].v : 0;
      const lukuPersentase = calculatePercentage(lukuSdHariIni, lukuRencana);
      
      // Tumbang/Chipping
      const tumbangRencana = cells[12] ? cells[12].v : 0;
      const tumbangHariIni = cells[13] ? cells[13].v : 0;
      const tumbangSdHariIni = cells[14] ? cells[14].v : 0;
      const tumbangPersentase = calculatePercentage(tumbangSdHariIni, tumbangRencana);
      
      // Pembuatan Parit
      const paritRencana = cells[16] ? cells[16].v : 0;
      const paritHariIni = cells[17] ? cells[17].v : 0;
      const paritSdHariIni = cells[18] ? cells[18].v : 0;
      const paritPersentase = calculatePercentage(paritSdHariIni, paritRencana);
      
      // Menanam Mucuna
      const mucunaRencana = cells[20] ? cells[20].v : 0;
      const mucunaHariIni = cells[21] ? cells[21].v : 0;
      const mucunaSdHariIni = cells[22] ? cells[22].v : 0;
      const mucunaPersentase = calculatePercentage(mucunaSdHariIni, mucunaRencana);
      
      // Lubang Tanam
      const lubangRencana = cells[24] ? cells[24].v : 0;
      const lubangHariIni = cells[25] ? cells[25].v : 0;
      const lubangSdHariIni = cells[26] ? cells[26].v : 0;
      const lubangPersentase = calculatePercentage(lubangSdHariIni, lubangRencana);
      
      // Menanam KS
      const ksRencana = cells[28] ? cells[28].v : 0;
      const ksHariIni = cells[29] ? cells[29].v : 0;
      const ksSdHariIni = cells[30] ? cells[30].v : 0;
      const ksPersentase = calculatePercentage(ksSdHariIni, ksRencana);
      
      // Total LC
      const lcRencana = cells[32] ? cells[32].v : 0;
      const lcRealisasi = cells[33] ? cells[33].v : 0;
      const lcPersentase = calculatePercentage(lcRealisasi, lcRencana);
      
      // Tanggal SPPBJ
      const tanggalSPPBJ = cells[35] ? cells[35].f || cells[35].v : '';
      
      // Jumlah Hari Kerja
      const jumlahHariKerja = cells[36] ? cells[36].v : 0;
      
      // Buat objek AFD
      const afd = {
        nama: afdName,
        luasPaket: luasPaket,
        ripper: {
          rencana: ripperRencana,
          hariIni: ripperHariIni,
          sdHariIni: ripperSdHariIni,
          persentase: ripperPersentase
        },
        luku: {
          rencana: lukuRencana,
          hariIni: lukuHariIni,
          sdHariIni: lukuSdHariIni,
          persentase: lukuPersentase
        },
        tumbangChipping: {
          rencana: tumbangRencana,
          hariIni: tumbangHariIni,
          sdHariIni: tumbangSdHariIni,
          persentase: tumbangPersentase
        },
        pembuatanParit: {
          rencana: paritRencana,
          hariIni: paritHariIni,
          sdHariIni: paritSdHariIni,
          persentase: paritPersentase
        },
        menanamMucuna: {
          rencana: mucunaRencana,
          hariIni: mucunaHariIni,
          sdHariIni: mucunaSdHariIni,
          persentase: mucunaPersentase
        },
        lubangTanam: {
          rencana: lubangRencana,
          hariIni: lubangHariIni,
          sdHariIni: lubangSdHariIni,
          persentase: lubangPersentase
        },
        menanamKS: {
          rencana: ksRencana,
          hariIni: ksHariIni,
          sdHariIni: ksSdHariIni,
          persentase: ksPersentase
        },
        totalLC: {
          rencana: lcRencana,
          realisasi: lcRealisasi,
          persentase: lcPersentase
        },
        tanggalSPPBJ: tanggalSPPBJ,
        jumlahHariKerja: jumlahHariKerja
      };
      
      // Tambahkan AFD ke array AFD
      currentAfd.push(afd);
      
      // Update total kebun
      currentKebun.totalLuasPaket += luasPaket;
      currentKebun.ripper.rencana += ripperRencana;
      currentKebun.ripper.hariIni += ripperHariIni;
      currentKebun.ripper.sdHariIni += ripperSdHariIni;
      currentKebun.ripper.persentase = calculatePercentage(
        currentKebun.ripper.sdHariIni, 
        currentKebun.ripper.rencana
      );
      
      currentKebun.luku.rencana += lukuRencana;
      currentKebun.luku.hariIni += lukuHariIni;
      currentKebun.luku.sdHariIni += lukuSdHariIni;
      currentKebun.luku.persentase = calculatePercentage(
        currentKebun.luku.sdHariIni, 
        currentKebun.luku.rencana
      );
      
      currentKebun.tumbangChipping.rencana += tumbangRencana;
      currentKebun.tumbangChipping.hariIni += tumbangHariIni;
      currentKebun.tumbangChipping.sdHariIni += tumbangSdHariIni;
      currentKebun.tumbangChipping.persentase = calculatePercentage(
        currentKebun.tumbangChipping.sdHariIni, 
        currentKebun.tumbangChipping.rencana
      );
      
      currentKebun.pembuatanParit.rencana += paritRencana;
      currentKebun.pembuatanParit.hariIni += paritHariIni;
      currentKebun.pembuatanParit.sdHariIni += paritSdHariIni;
      currentKebun.pembuatanParit.persentase = calculatePercentage(
        currentKebun.pembuatanParit.sdHariIni, 
        currentKebun.pembuatanParit.rencana
      );
      
      currentKebun.menanamMucuna.rencana += mucunaRencana;
      currentKebun.menanamMucuna.hariIni += mucunaHariIni;
      currentKebun.menanamMucuna.sdHariIni += mucunaSdHariIni;
      currentKebun.menanamMucuna.persentase = calculatePercentage(
        currentKebun.menanamMucuna.sdHariIni, 
        currentKebun.menanamMucuna.rencana
      );
      
      currentKebun.lubangTanam.rencana += lubangRencana;
      currentKebun.lubangTanam.hariIni += lubangHariIni;
      currentKebun.lubangTanam.sdHariIni += lubangSdHariIni;
      currentKebun.lubangTanam.persentase = calculatePercentage(
        currentKebun.lubangTanam.sdHariIni, 
        currentKebun.lubangTanam.rencana
      );
      
      currentKebun.menanamKS.rencana += ksRencana;
      currentKebun.menanamKS.hariIni += ksHariIni;
      currentKebun.menanamKS.sdHariIni += ksSdHariIni;
      currentKebun.menanamKS.persentase = calculatePercentage(
        currentKebun.menanamKS.sdHariIni, 
        currentKebun.menanamKS.rencana
      );
      
      currentKebun.totalLC.rencana += lcRencana;
      currentKebun.totalLC.realisasi += lcRealisasi;
      currentKebun.totalLC.persentase = calculatePercentage(
        currentKebun.totalLC.realisasi, 
        currentKebun.totalLC.rencana
      );
      
      // Gunakan tanggal SPPBJ dari AFD pertama
      if (!currentKebun.tanggalSPPBJ && tanggalSPPBJ) {
        currentKebun.tanggalSPPBJ = tanggalSPPBJ;
        currentKebun.jumlahHariKerja = calculateDaysDifference(tanggalSPPBJ);
      }
    }
  }
  
  // Tambahkan kebun terakhir
  if (currentKebun) {
    currentKebun.afd = currentAfd;
    result.kebun.push(currentKebun);
  }
  
  // Hitung total semua kebun
  result.total = {
    totalLuasPaket: 0,
    ripper: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    luku: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    tumbangChipping: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    pembuatanParit: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    menanamMucuna: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    lubangTanam: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    menanamKS: { rencana: 0, hariIni: 0, sdHariIni: 0, persentase: 0 },
    totalLC: { rencana: 0, realisasi: 0, persentase: 0 }
  };
  
  // Agregasi data dari semua kebun
  result.kebun.forEach(kebun => {
    result.total.totalLuasPaket += kebun.totalLuasPaket;
    
    result.total.ripper.rencana += kebun.ripper.rencana;
    result.total.ripper.hariIni += kebun.ripper.hariIni;
    result.total.ripper.sdHariIni += kebun.ripper.sdHariIni;
    
    result.total.luku.rencana += kebun.luku.rencana;
    result.total.luku.hariIni += kebun.luku.hariIni;
    result.total.luku.sdHariIni += kebun.luku.sdHariIni;
    
    result.total.tumbangChipping.rencana += kebun.tumbangChipping.rencana;
    result.total.tumbangChipping.hariIni += kebun.tumbangChipping.hariIni;
    result.total.tumbangChipping.sdHariIni += kebun.tumbangChipping.sdHariIni;
    
    result.total.pembuatanParit.rencana += kebun.pembuatanParit.rencana;
    result.total.pembuatanParit.hariIni += kebun.pembuatanParit.hariIni;
    result.total.pembuatanParit.sdHariIni += kebun.pembuatanParit.sdHariIni;
    
    result.total.menanamMucuna.rencana += kebun.menanamMucuna.rencana;
    result.total.menanamMucuna.hariIni += kebun.menanamMucuna.hariIni;
    result.total.menanamMucuna.sdHariIni += kebun.menanamMucuna.sdHariIni;
    
    result.total.lubangTanam.rencana += kebun.lubangTanam.rencana;
    result.total.lubangTanam.hariIni += kebun.lubangTanam.hariIni;
    result.total.lubangTanam.sdHariIni += kebun.lubangTanam.sdHariIni;
    
    result.total.menanamKS.rencana += kebun.menanamKS.rencana;
    result.total.menanamKS.hariIni += kebun.menanamKS.hariIni;
    result.total.menanamKS.sdHariIni += kebun.menanamKS.sdHariIni;
    
    result.total.totalLC.rencana += kebun.totalLC.rencana;
    result.total.totalLC.realisasi += kebun.totalLC.realisasi;
  });
  
  // Hitung persentase untuk total
  result.total.ripper.persentase = calculatePercentage(
    result.total.ripper.sdHariIni, 
    result.total.ripper.rencana
  );
  
  result.total.luku.persentase = calculatePercentage(
    result.total.luku.sdHariIni, 
    result.total.luku.rencana
  );
  
  result.total.tumbangChipping.persentase = calculatePercentage(
    result.total.tumbangChipping.sdHariIni, 
    result.total.tumbangChipping.rencana
  );
  
  result.total.pembuatanParit.persentase = calculatePercentage(
    result.total.pembuatanParit.sdHariIni, 
    result.total.pembuatanParit.rencana
  );
  
  result.total.menanamMucuna.persentase = calculatePercentage(
    result.total.menanamMucuna.sdHariIni, 
    result.total.menanamMucuna.rencana
  );
  
  result.total.lubangTanam.persentase = calculatePercentage(
    result.total.lubangTanam.sdHariIni, 
    result.total.lubangTanam.rencana
  );
  
  result.total.menanamKS.persentase = calculatePercentage(
    result.total.menanamKS.sdHariIni, 
    result.total.menanamKS.rencana
  );
  
  result.total.totalLC.persentase = calculatePercentage(
    result.total.totalLC.realisasi, 
    result.total.totalLC.rencana
  );
  
  return result;
};