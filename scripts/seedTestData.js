// seedTestData.js – run with `node scripts/seedTestData.js`
const axios = require('axios');
const API = 'http://localhost:5000/api'; // matches frontend API base URL

(async () => {
    try {
        // Admin credentials (ensure admin exists)
        const adminEmail = 'demo@stockmaster.com';
        const adminPass = 'demo123';
        const adminLogin = await axios.post(`${API}/auth/login`, { email: adminEmail, password: adminPass });
        const adminToken = adminLogin.data.token;
        const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };
        console.log('✅ Admin logged in');

        // Create or fetch Bangalore Warehouse
        const warehouseName = 'Bangalore Warehouse';
        let warehouseId;
        try {
            const whRes = await axios.post(`${API}/warehouses`, { name: warehouseName, location: 'Bangalore' }, adminHeaders);
            warehouseId = whRes.data.id;
            console.log('🏬 Warehouse created', warehouseId);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                // Likely duplicate – fetch existing
                const allWh = await axios.get(`${API}/warehouses`, adminHeaders);
                const existing = allWh.data.find(w => w.name === warehouseName);
                warehouseId = existing ? existing.id : null;
                console.log('🏬 Warehouse already exists, id', warehouseId);
            } else {
                throw e;
            }
        }

        // Products to seed
        const products = [
            { name: 'iPhone 15 Pro', sku: 'IP15P', category: 'Finished Goods', price: 99999, stock: 20, unit: 'pcs', warehouseId },
            { name: 'Samsung Galaxy S24', sku: 'SGS24', category: 'Finished Goods', price: 79999, stock: 20, unit: 'pcs', warehouseId }
        ];

        for (const p of products) {
            try {
                const prodRes = await axios.post(`${API}/products`, p, adminHeaders);
                console.log('📦 Product created', prodRes.data.id);
            } catch (e) {
                if (e.response && e.response.status === 400) {
                    console.log('⚠️ Product may already exist', p.sku);
                } else {
                    console.error('❌ Error creating product', p.sku, e.message);
                }
            }
        }

        console.log('✅ Seeding complete');
    } catch (err) {
        console.error('❌ Unexpected error', err.message);
    }
})();
