// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel(rawData) {
  if (!rawData || !rawData.table || !rawData.table.rows) {
    console.error('Data tidak valid untuk diekspor');
    return;
  }

  // Format header sesuai dengan tabel asli
  const headers = [
    'No',
    'Kebun',
    'AFD',
    'Luas Paket (ha)',
    'Ripper Rencana',
    'Ripper Hari Ini',
    'Ripper SD Hari Ini',
    'Luku Rencana',
    'Luku Hari Ini',
    'Luku SD Hari Ini',
    'Tumbang/Chipping Rencana',
    'Tumbang/Chipping Hari Ini',
    'Tumbang/Chipping SD Hari Ini',
    'Pembuatan Parit Rencana',
    'Pembuatan Parit Hari Ini',
    'Pembuatan Parit SD Hari Ini',
    'Menanam Mucuna Rencana',
    'Menanam Mucuna Hari Ini',
    'Menanam Mucuna SD Hari Ini',
    'Lubang Tanam Rencana',
    'Lubang Tanam Hari Ini',
    'Lubang Tanam SD Hari Ini',
    'Menanam KS Rencana',
    'Menanam KS Hari Ini',
    'Menanam KS SD Hari Ini',
    'Total LC Rencana',
    'Total LC Realisasi',
    'Tanggal SPPBJ',
    'Jumlah Hari Kerja'
  ];

  // Proses data mentah menjadi format yang sesuai
  const rows = [];
  let currentKebun = null;
  let no = 0;
  
  const dataRows = rawData.table.rows;
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const cells = row.c;
    
    // Skip baris kosong
    if (!cells || cells.length === 0) continue;
    
    // Cek apakah ini baris nama kebun
    const kebunName = cells[1] ? cells[1].v : '';
    
    // Skip baris header
    if (kebunName === 'Kebun') continue;
    
    // Skip baris "Jumlah"
    if (cells[0] && cells[0].v === 'Jumlah') continue;
    
    // Skip baris "Total"
    if (cells[0] && cells[0].v === 'Total') continue;
    
    // Ambil data dari sel
    const afdName = cells[2] ? cells[2].v : '';
    const luasPaket = cells[3] ? cells[3].v : 0;
    
    // LOGIKA BARU: Skip baris yang tidak memiliki kebun dan AFD
    if (!kebunName && !afdName) {
      continue; // Lewati baris ini
    }
    
    // Jika ini baris nama kebun, set currentKebun
    if (kebunName) {
      currentKebun = kebunName;
    }
    
    // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
    if (!afdName && !kebunName) {
      continue; // Lewati baris ini
    }
    
    // Tambahkan ke result hanya jika ada data yang valid
    if (currentKebun && afdName) {
      no++;
      rows.push([
        no,
        currentKebun,
        afdName,
        luasPaket,
        cells[4] ? cells[4].v : 0, // Ripper Rencana
        cells[5] ? cells[5].v : 0, // Ripper Hari Ini
        cells[6] ? cells[6].v : 0, // Ripper SD Hari Ini
        cells[8] ? cells[8].v : 0, // Luku Rencana
        cells[9] ? cells[9].v : 0, // Luku Hari Ini
        cells[10] ? cells[10].v : 0, // Luku SD Hari Ini
        cells[12] ? cells[12].v : 0, // Tumbang/Chipping Rencana
        cells[13] ? cells[13].v : 0, // Tumbang/Chipping Hari Ini
        cells[14] ? cells[14].v : 0, // Tumbang/Chipping SD Hari Ini
        cells[16] ? cells[16].v : 0, // Pembuatan Parit Rencana
        cells[17] ? cells[17].v : 0, // Pembuatan Parit Hari Ini
        cells[18] ? cells[18].v : 0, // Pembuatan Parit SD Hari Ini
        cells[20] ? cells[20].v : 0, // Menanam Mucuna Rencana
        cells[21] ? cells[21].v : 0, // Menanam Mucuna Hari Ini
        cells[22] ? cells[22].v : 0, // Menanam Mucuna SD Hari Ini
        cells[24] ? cells[24].v : 0, // Lubang Tanam Rencana
        cells[25] ? cells[25].v : 0, // Lubang Tanam Hari Ini
        cells[26] ? cells[26].v : 0, // Lubang Tanam SD Hari Ini
        cells[28] ? cells[28].v : 0, // Menanam KS Rencana
        cells[29] ? cells[29].v : 0, // Menanam KS Hari Ini
        cells[30] ? cells[30].v : 0, // Menanam KS SD Hari Ini
        cells[32] ? cells[32].v : 0, // Total LC Rencana
        cells[33] ? cells[33].v : 0, // Total LC Realisasi
        cells[35] ? (cells[35].f || cells[35].v) : '', // Tanggal SPPBJ
        '' // Jumlah Hari Kerja (akan dihitung nanti)
      ]);
    }
  }

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Styling header row dengan warna biru aksen 60%
  const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { 
        bold: true, 
        color: { rgb: "FFFFFF" }, // Teks putih
        sz: 12
      },
      fill: { 
        // Warna biru aksen 60% (RGB: 91, 155, 213)
        fgColor: { rgb: "5B9BD5" } 
      },
      alignment: { 
        horizontal: "center", 
        vertical: "center",
        wrapText: true
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
  }


  // Styling data rows
  for (let R = 1; R <= headerRange.e.r; ++R) {
    // Style untuk kolom No
    const noCell = XLSX.utils.encode_cell({ r: R, c: 0 });
    if (worksheet[noCell]) {
      worksheet[noCell].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style untuk kolom Kebun
    const kebunCell = XLSX.utils.encode_cell({ r: R, c: 1 });
    if (worksheet[kebunCell]) {
      worksheet[kebunCell].s = {
        font: { bold: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style untuk kolom AFD
    const afdCell = XLSX.utils.encode_cell({ r: R, c: 2 });
    if (worksheet[afdCell]) {
      worksheet[afdCell].s = {
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }
    
    // Style untuk kolom numerik
    for (let C = 3; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }
    }
  }

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 15 },  // Kebun
    { wch: 8 },   // AFD
    { wch: 15 },  // Luas Paket
    { wch: 15 },  // Ripper Rencana
    { wch: 15 },  // Ripper Hari Ini
    { wch: 15 },  // Ripper SD Hari Ini
    { wch: 15 },  // Luku Rencana
    { wch: 15 },  // Luku Hari Ini
    { wch: 15 },  // Luku SD Hari Ini
    { wch: 20 },  // Tumbang/Chipping Rencana
    { wch: 20 },  // Tumbang/Chipping Hari Ini
    { wch: 20 },  // Tumbang/Chipping SD Hari Ini
    { wch: 20 },  // Pembuatan Parit Rencana
    { wch: 20 },  // Pembuatan Parit Hari Ini
    { wch: 20 },  // Pembuatan Parit SD Hari Ini
    { wch: 20 },  // Menanam Mucuna Rencana
    { wch: 20 },  // Menanam Mucuna Hari Ini
    { wch: 20 },  // Menanam Mucuna SD Hari Ini
    { wch: 15 },  // Lubang Tanam Rencana
    { wch: 15 },  // Lubang Tanam Hari Ini
    { wch: 15 },  // Lubang Tanam SD Hari Ini
    { wch: 15 },  // Menanam KS Rencana
    { wch: 15 },  // Menanam KS Hari Ini
    { wch: 15 },  // Menanam KS SD Hari Ini
    { wch: 15 },  // Total LC Rencana
    { wch: 15 },  // Total LC Realisasi
    { wch: 15 },  // Tanggal SPPBJ
    { wch: 15 }   // Jumlah Hari Kerja
  ];

  // Set row heights
  worksheet['!rows'] = [
    { hpt: 30 },  // Header row height
    ...Array(rows.length).fill({ hpt: 20 })  // Data row heights
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Progress Tanaman');

  // Tambahkan sheet informasi
  const infoData = [
    ['LAPORAN PROGRESS TANAMAN'],
    [''],
    ['Dicetak pada:', new Date().toLocaleDateString('id-ID')],
    ['Sumber Data:', 'Sistem Monitoring Tanaman']
  ];
  
  const infoWorksheet = XLSX.utils.aoa_to_sheet(infoData);
  
  // Styling untuk sheet informasi
  infoWorksheet['A1'].s = {
    font: { bold: true, sz: 16 },
    alignment: { horizontal: "center" }
  };
  
  // Set lebar kolom untuk sheet informasi
  infoWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }];
  
  XLSX.utils.book_append_sheet(workbook, infoWorksheet, 'Informasi');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, `Data_Progress_Tanaman_${new Date().toISOString().slice(0, 10)}.xlsx`);
}