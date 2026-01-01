const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

class JSONDB {
    constructor() {
        this.data = { users: [], products: [], categories: [], transactions: [] };
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(DB_PATH)) {
                const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
                this.data = JSON.parse(fileContent);
            } else {
                this.save();
            }
        } catch (error) {
            console.error('Error loading database:', error);
        }
    }

    save() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    // Generic methods
    get(collectionName) {
        return this.data[collectionName] || [];
    }

    findById(collectionName, id) {
        return this.data[collectionName]?.find(item => item.id === id);
    }

    add(collectionName, item) {
        if (!this.data[collectionName]) this.data[collectionName] = [];
        this.data[collectionName].push(item);
        this.save();
        return item;
    }

    update(collectionName, id, updates) {
        const list = this.data[collectionName];
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updates };
            this.save();
            return list[index];
        }
        return null;
    }

    remove(collectionName, id) {
        const list = this.data[collectionName];
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
            const deleted = list[index];
            list.splice(index, 1);
            this.save();
            return deleted;
        }
        return null;
    }
}

const db = new JSONDB();
module.exports = db;
