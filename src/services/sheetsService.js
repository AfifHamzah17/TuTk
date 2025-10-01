// src/services/sheetsService.js
import axios from 'axios';

const SHEET_ID = '1Hhf5BKPliRa7KK1XTLvjHH7wQ-pmHdkCFnFK6dvGbIc';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export const fetchSheetData = async () => {
  try {
    const response = await axios.get(BASE_URL);
    // Data dari Google Sheets API berada dalam format khusus
    const jsonString = response.data.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};