<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Enter your password"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          required 
          placeholder="Confirm your password"
        />
      </div>
      <!-- Role selection hanya untuk admin yang sudah login -->
      <div v-if="isAdmin" class="form-group">
        <label for="role">Role</label>
        <select id="role" v-model="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script>
import { register } from '../services/authService';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      error: '',
      isLoading: false,
      isAdmin: false
    };
  },
  created() {
    // Cek apakah user yang sudah login adalah admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin';
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.error = '';
      
      // Validasi password
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        this.isLoading = false;
        return;
      }
      
      try {
        const userData = {
          email: this.email,
          password: this.password,
          role: this.isAdmin ? this.role : 'user'
        };
        
        const response = await register(userData);
        
        // Redirect ke halaman dashboard
        this.$router.push('/');
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed. Please try again.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>