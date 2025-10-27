<template>
  <div class="admin-dashboard">
    <h2>Admin Dashboard</h2>
    
    <div class="card">
      <h3>Create Admin User</h3>
      <form @submit.prevent="handleCreateAdmin">
        <div class="form-group">
          <label for="adminEmail">Email</label>
          <input 
            type="email" 
            id="adminEmail" 
            v-model="adminEmail" 
            required 
            placeholder="Enter admin email"
          />
        </div>
        <div class="form-group">
          <label for="adminPassword">Password</label>
          <input 
            type="password" 
            id="adminPassword" 
            v-model="adminPassword" 
            required 
            placeholder="Enter admin password"
          />
        </div>
        <div v-if="adminError" class="error-message">{{ adminError }}</div>
        <button type="submit" :disabled="isCreatingAdmin">
          {{ isCreatingAdmin ? 'Creating...' : 'Create Admin' }}
        </button>
      </form>
    </div>
    
    <div class="card">
      <h3>All Users</h3>
      <div v-if="loadingUsers" class="loading">Loading users...</div>
      <div v-else-if="usersError" class="error-message">{{ usersError }}</div>
      <div v-else>
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, createAdminUser } from '@/services/authService';
import { formatDate } from '@/utils/dateUtils';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      adminEmail: '',
      adminPassword: '',
      loadingUsers: false,
      isCreatingAdmin: false,
      usersError: '',
      adminError: ''
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    formatDate,
    async loadUsers() {
      this.loadingUsers = true;
      this.usersError = '';
      
      try {
        const response = await getAllUsers();
        this.users = response.users;
      } catch (error) {
        this.usersError = error.response?.data?.message || 'Failed to load users';
        console.error(error);
      } finally {
        this.loadingUsers = false;
      }
    },
    async handleCreateAdmin() {
      this.isCreatingAdmin = true;
      this.adminError = '';
      
      try {
        const userData = {
          email: this.adminEmail,
          password: this.adminPassword
        };
        
        const response = await createAdminUser(userData);
        
        // Reset form
        this.adminEmail = '';
        this.adminPassword = '';
        
        // Reload users list
        this.loadUsers();
      } catch (error) {
        this.adminError = error.response?.data?.message || 'Failed to create admin user';
        console.error(error);
      } finally {
        this.isCreatingAdmin = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
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

.loading {
  padding: 10px 0;
  color: #666;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.users-table th, .users-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
</style>