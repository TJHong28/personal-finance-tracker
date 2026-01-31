<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()
const newCategory = ref('')
const editingCategory = ref<string | null>(null)
const editInput = ref('')

const handleAdd = () => {
  if (newCategory.value.trim()) {
    store.addCategory(newCategory.value.trim())
    newCategory.value = ''
  }
}

const startEdit = (cat: string) => {
  editingCategory.value = cat
  editInput.value = cat
}

const saveEdit = () => {
  if (editingCategory.value && editInput.value.trim()) {
    store.updateCategory(editingCategory.value, editInput.value.trim())
    editingCategory.value = null
  }
}

const handleDelete = (cat: string) => {
  if (confirm(`Are you sure you want to delete "${cat}"?`)) {
    store.deleteCategory(cat)
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="cat-card">
      <header>
        <button @click="router.back()" class="btn-back">← Back</button>
        <h2>Manage Categories</h2>
      </header>

      <div class="add-section">
        <div class="input-group">
          <input 
            v-model="newCategory" 
            @keyup.enter="handleAdd" 
            placeholder="Enter new category name..." 
            class="input-clean"
          />
          <button @click="handleAdd" class="btn-add">Add</button>
        </div>
      </div>

      <ul class="cat-list">
        <li v-for="cat in store.categories" :key="cat" class="cat-item">
          
          <div v-if="editingCategory !== cat" class="view-mode">
            <span class="cat-name">{{ cat }}</span>
            <div class="actions">
              <button @click="startEdit(cat)" class="btn-icon">✏️</button>
              <button @click="handleDelete(cat)" class="btn-icon delete">🗑️</button>
            </div>
          </div>

          <div v-else class="edit-mode">
            <input v-model="editInput" @keyup.enter="saveEdit" class="input-edit" />
            <div class="edit-actions">
              <button @click="saveEdit" class="btn-xs-primary">Save</button>
              <button @click="editingCategory = null" class="btn-xs-secondary">Cancel</button>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex; justify-content: center;
  font-family: 'Inter', sans-serif;
}

.cat-card {
  background: white; width: 100%; max-width: 500px; border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; overflow: hidden; height: fit-content;
}

header {
  padding: 24px; border-bottom: 1px solid #f1f5f9; text-align: center; position: relative;
}
header h2 { margin: 0; font-size: 1.25rem; color: #0f172a; }
.btn-back { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; font-size: 0.9rem; }
.btn-back:hover { color: #4f46e5; }

/* Add Section */
.add-section { padding: 20px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.input-group { display: flex; gap: 10px; }
.input-clean {
  flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; background: white;
}
.input-clean:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }

.btn-add { background: #4f46e5; color: white; border: none; padding: 0 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-add:hover { background: #4338ca; }

/* List Styles */
.cat-list { list-style: none; padding: 0; margin: 0; }
.cat-item { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; transition: background 0.1s; }
.cat-item:last-child { border-bottom: none; }
.cat-item:hover { background: #f8fafc; }

.view-mode { display: flex; justify-content: space-between; align-items: center; }
.cat-name { font-weight: 500; color: #334155; }

.btn-icon { background: white; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; color: #64748b; margin-left: 8px; transition: all 0.2s; }
.btn-icon:hover { border-color: #4f46e5; color: #4f46e5; }
.btn-icon.delete:hover { border-color: #ef4444; color: #ef4444; }

/* Edit Mode */
.edit-mode { display: flex; align-items: center; gap: 10px; }
.input-edit { flex: 1; padding: 8px; border: 1px solid #4f46e5; border-radius: 6px; font-size: 0.95rem; outline: none; }
.edit-actions { display: flex; gap: 5px; }
.btn-xs-primary { background: #4f46e5; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.btn-xs-secondary { background: #e2e8f0; color: #475569; border: none; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
</style>