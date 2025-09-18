// src/services/sheetsService.js
import axios from 'axios';

const SHEET_ID = '1v7ERyKHZw7jG4HQ0vLIUq5TgFzU4iVLf-T4U-kKtATA';
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