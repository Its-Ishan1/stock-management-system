// import fetch from 'node-fetch'; // Native fetch is available in Node 18+

const BASE_URL = 'http://localhost:5002/api';
let token = '';
let userId = '';
let warehouseId = '';
let productId = '';

async function runTest() {
    try {
        console.log('🚀 Starting Backend Verification...');

        // 1. Register User
        console.log('\n1. Registering User...');
        const email = `test${Date.now()}@example.com`;
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123',
                name: 'Test User'
            })
        });
        const registerData = await registerRes.json();
        if (!registerRes.ok) throw new Error(registerData.error);
        console.log('✅ User Registered:', registerData.user.email);
        token = registerData.token;
        userId = registerData.user.id;

        // 2. Create Warehouse
        console.log('\n2. Creating Warehouse...');
        const warehouseRes = await fetch(`${BASE_URL}/warehouses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Warehouse',
                location: 'Test Location',
                capacity: 1000
            })
        });
        const warehouseData = await warehouseRes.json();
        if (!warehouseRes.ok) throw new Error(warehouseData.error);
        console.log('✅ Warehouse Created:', warehouseData.name);
        warehouseId = warehouseData.id;

        // 3. Create Product
        console.log('\n3. Creating Product...');
        const productRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sku: `SKU-${Date.now()}`,
                name: 'Test Product',
                category: 'Test Category',
                stock: 0,
                minStock: 10,
                price: 100,
                warehouseId
            })
        });
        const productData = await productRes.json();
        if (!productRes.ok) throw new Error(productData.error);
        console.log('✅ Product Created:', productData.name, 'Stock:', productData.stock);
        productId = productData.id;

        // 4. Create Receipt (Add Stock)
        console.log('\n4. Creating Receipt (+50 stock)...');
        const receiptRes = await fetch(`${BASE_URL}/receipts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                warehouseId,
                supplier: 'Test Supplier',
                items: [
                    { productId, quantity: 50, cost: 50 }
                ]
            })
        });
        const receiptData = await receiptRes.json();
        if (!receiptRes.ok) throw new Error(receiptData.error);
        console.log('✅ Receipt Created:', receiptData.receiptNumber);

        // Verify Stock
        const productCheck1 = await fetch(`${BASE_URL}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const productData1 = await productCheck1.json();
        console.log('🔍 Stock after Receipt:', productData1.stock);
        if (productData1.stock !== 50) throw new Error('Stock mismatch after receipt');

        // 5. Create Adjustment (Remove Stock)
        console.log('\n5. Creating Adjustment (-5 stock)...');
        const adjustmentRes = await fetch(`${BASE_URL}/adjustments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                warehouseId,
                type: 'decrement',
                quantity: 5,
                reason: 'Damaged'
            })
        });
        const adjustmentData = await adjustmentRes.json();
        if (!adjustmentRes.ok) throw new Error(adjustmentData.error);
        console.log('✅ Adjustment Created');

        // Verify Stock
        const productCheck2 = await fetch(`${BASE_URL}/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const productData2 = await productCheck2.json();
        console.log('🔍 Stock after Adjustment:', productData2.stock);
        if (productData2.stock !== 45) throw new Error('Stock mismatch after adjustment');

        // 6. Test Forgot Password
        console.log('\n6. Testing Forgot Password...');
        const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const forgotData = await forgotRes.json();
        if (!forgotRes.ok) throw new Error(forgotData.error);
        console.log('✅ Forgot Password Request Sent:', forgotData.message);

        console.log('\n🎉 All Tests Passed!');
    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        process.exit(1);
    }
}

runTest();
