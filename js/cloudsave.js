class CloudSaveManager {
    constructor(apiUrl) {
        // Your Worker URL
        this.apiUrl = apiUrl || 'https://workstudy-saves.354271744.workers.dev';
        this.saveStatus = document.getElementById('saveStatus');
    }

    async saveProgress() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                this.updateStatus('❌ Not logged in', 'error');
                return;
            }

            this.updateStatus('💾 Saving...', 'loading');

            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                allData[key] = localStorage.getItem(key);
            }

            const response = await fetch(`${this.apiUrl}/api/save-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ saveData: allData })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save');
            }

            this.updateStatus('✅ Saved!', 'success');
        } catch (error) {
            this.updateStatus(`❌ ${error.message}`, 'error');
        }
    }

    async loadProgress() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                this.updateStatus('❌ Not logged in', 'error');
                return;
            }

            this.updateStatus('📥 Loading...', 'loading');

            const response = await fetch(`${this.apiUrl}/api/load-progress`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to load');
            }

            const result = await response.json();

            if (confirm('⚠️ Overwrite current progress?')) {
                const userData = JSON.parse(localStorage.getItem('user'));
                localStorage.clear();
                localStorage.setItem('user', JSON.stringify(userData));

                Object.entries(result.saveData).forEach(([key, value]) => {
                    if (key !== 'user') {
                        localStorage.setItem(key, value);
                    }
                });

                this.updateStatus('✅ Loaded! Reloading...', 'success');
                setTimeout(() => location.reload(), 1500);
            }
        } catch (error) {
            this.updateStatus(`❌ ${error.message}`, 'error');
        }
    }

    async deleteSave() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                this.updateStatus('❌ Not logged in', 'error');
                return;
            }

            if (!confirm('🗑️ Delete cloud save? (Cannot undo)')) return;

            this.updateStatus('🗑️ Deleting...', 'loading');

            const response = await fetch(`${this.apiUrl}/api/delete-save`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) throw new Error('Delete failed');

            this.updateStatus('✅ Deleted!', 'success');
        } catch (error) {
            this.updateStatus(`❌ ${error.message}`, 'error');
        }
    }

    updateStatus(message, type) {
        this.saveStatus.textContent = message;
        this.saveStatus.style.color = 
            type === 'error' ? '#ef4444' : 
            type === 'success' ? '#22c55e' : 
            'var(--text)';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const cloudSave = new CloudSaveManager();

    document.getElementById('saveProgressBtn')?.addEventListener('click', () => cloudSave.saveProgress());
    document.getElementById('loadProgressBtn')?.addEventListener('click', () => cloudSave.loadProgress());
    document.getElementById('deleteProgressBtn')?.addEventListener('click', () => cloudSave.deleteSave());
});
