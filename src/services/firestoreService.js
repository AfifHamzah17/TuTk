import { db } from '@/config/firestore';

// Service untuk Tanaman Ulang
export const getTanamanUlangData = async () => {
  try {
    const snapshot = await db.collection('tanamanUlang').get();
    const data = [];
    
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return data;
  } catch (error) {
    console.error('Error getting tanaman ulang data:', error);
    throw error;
  }
};

export const addTanamanUlangData = async (data) => {
  try {
    const docRef = await db.collection('tanamanUlang').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data
    };
  } catch (error) {
    console.error('Error adding tanaman ulang data:', error);
    throw error;
  }
};

export const updateTanamanUlangData = async (id, data) => {
  try {
    await db.collection('tanamanUlang').doc(id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...data
    };
  } catch (error) {
    console.error('Error updating tanaman ulang data:', error);
    throw error;
  }
};

export const deleteTanamanUlangData = async (id) => {
  try {
    await db.collection('tanamanUlang').doc(id).delete();
    return { id };
  } catch (error) {
    console.error('Error deleting tanaman ulang data:', error);
    throw error;
  }
};

// Service untuk Tanaman Konversi
export const getTanamanKonversiData = async () => {
  try {
    const snapshot = await db.collection('tanamanKonversi').get();
    const data = [];
    
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return data;
  } catch (error) {
    console.error('Error getting tanaman konversi data:', error);
    throw error;
  }
};

export const addTanamanKonversiData = async (data) => {
  try {
    const docRef = await db.collection('tanamanKonversi').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data
    };
  } catch (error) {
    console.error('Error adding tanaman konversi data:', error);
    throw error;
  }
};

export const updateTanamanKonversiData = async (id, data) => {
  try {
    await db.collection('tanamanKonversi').doc(id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...data
    };
  } catch (error) {
    console.error('Error updating tanaman konversi data:', error);
    throw error;
  }
};

export const deleteTanamanKonversiData = async (id) => {
  try {
    await db.collection('tanamanKonversi').doc(id).delete();
    return { id };
  } catch (error) {
    console.error('Error deleting tanaman konversi data:', error);
    throw error;
  }
};