<template>
    <div class="vista-docente">
        <navBar />
        <div class="body">
            <div class="table-container">
                <!-- Search Input -->
                <div class="search-container">
                    <input type="text" v-model="searchQuery" placeholder="Search for users" class="search-input" />
                </div>

                <!-- Table -->
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Carrera</th>
                            <th>Riesgo</th>
                            <th>Agregar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in filteredUsers" :key="index" class="table-row">
                            <td class="user-info">
                                <img :src="user.image" class="profile-image" alt="Profile Image">
                                <div>
                                    <div class="user-name">{{ user.name }}</div>
                                    <div class="user-email">{{ user.email }}</div>
                                </div>
                            </td>
                            <td>{{ user.position }}</td>
                            <td><div :class="['status', user.statusColorClass]">{{ user.status }}</div></td>
                            <td><button @click="openEditModal(user)" class="edit-button">Agregar Falta</button></td>
                        </tr>
                    </tbody>
                </table>

                <!-- Edit User Modal -->
                <div v-if="isEditModalOpen" class="modal">
                    <div class="modal-content">
                        <form @submit.prevent="saveUser">
                            <h3>Edit user</h3>
                            <div class="form-group">
                                <label>First Name</label>
                                <input type="text" v-model="currentUser.firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name</label>
                                <input type="text" v-model="currentUser.lastName" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" v-model="currentUser.email" required>
                            </div>
                            <div class="form-group">
                                <label>Position</label>
                                <input type="text" v-model="currentUser.position" required>
                            </div>
                            <div class="modal-actions">
                                <button type="submit" class="button-primary">Save Changes</button>
                                <button @click="closeEditModal" type="button" class="button-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navBar from '@/components/AppNavbar.vue';
import autenticadorSesion from '@/mixins/AutenticadorSesion';

export default {
    name: "alumnos",
    mixins: [autenticadorSesion],
    components: {
      navBar,
    },
    data() {
        return {
            isDropdownOpen: false,
            isEditModalOpen: false,
            searchQuery: '',
            currentUser: {
                firstName: '',
                lastName: '',
                email: '',
                position: ''
            },
            users: [
                { name: "Daniel Moreno", email: "dmoreno@utalca.cl", position: "Ingenieria Civil en Computación", status: "Limpio", statusColorClass: "online", image: require('../assets/Profile.png') },
                { name: "Daniel Moreno", email: "dmoreno@utalca.cl", position: "Ingenieria Civil en Computación", status: "Limpio", statusColorClass: "online", image: require('../assets/Profile.png') },
                { name: "Daniel Moreno", email: "dmoreno@utalca.cl", position: "Ingenieria Civil en Computación", status: "Limpio", statusColorClass: "online", image: require('../assets/Profile.png') },
                { name: "Daniel Moreno", email: "dmoreno@utalca.cl", position: "Ingenieria Civil en Computación", status: "Limpio", statusColorClass: "online", image: require('../assets/Profile.png') },
                { name: "Daniel Moreno", email: "dmoreno@utalca.cl", position: "Ingenieria Civil en Computación", status: "Limpio", statusColorClass: "online", image: require('../assets/Profile.png') },
            ]
        }
    },
    computed: {
        filteredUsers() {
            return this.users.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },
    methods: {
        openEditModal(user) {
            this.isEditModalOpen = true;
            this.currentUser = { ...user };
        },
        closeEditModal() {
            this.isEditModalOpen = false;
        },
        saveUser() {
            this.isEditModalOpen = false;
        }
    }
}
</script>

<style scoped>
.vista-docente {
    background-image: url('../assets/oficina.jpg');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.table-container {
    width: 100%;
    max-width: 2000px;
    background-color: #bfd0db;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #000000;
}

.search-container {
    margin-bottom: 15px;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #85949e;
    border-radius: 6px;
    background-color: #d1e7f7;
    color: #f5f5f5;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
}

.user-table th, .user-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #000000;
}

.user-table th {
    background-color: #d1e7f7;
    color: #221b1b;
    font-weight: 600;
}

.user-table .table-row:hover {
    background-color: #85949e;
}

.user-info {
    
    display: flex;
    align-items: center;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 30px;
}

.user-name {
    font-weight: bold;
    color: #221b1b;

}

.user-email {
    color: #41454b;
    padding-right: 30px;
}

.status {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
}

.online {
    background-color: #22c55e;
    color: white;
}

.offline {
    background-color: #ef4444;
    color: white;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(204, 174, 174, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-group {
    margin-bottom: 16px;
}

.input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.button-primary {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.button-secondary {
    padding: 8px 16px;
    background-color: #e0e0e0;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.edit-button {
    color: #021027;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font-weight: 500;
    padding-right: 30px;
}
</style>
