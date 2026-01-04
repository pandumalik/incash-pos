const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./models/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());




app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.get('users').find(u => u.username === username && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


app.get('/products', (req, res) => {
    const { category, search } = req.query;
    let products = db.get('products');

    if (category && category !== 'All') {
        products = products.filter(p => p.category === category);
    }

    if (search) {
        const term = search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            (p.barcode && p.barcode.includes(term))
        );
    }

    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = db.findById('products', req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/products', (req, res) => {
    const newProduct = { ...req.body, id: uuidv4() };
    db.add('products', newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const updatedProduct = db.update('products', req.params.id, req.body);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/products/:id', (req, res) => {
    const deleted = db.remove('products', req.params.id);
    if (deleted) {
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


app.get('/categories', (req, res) => {
    res.json(db.get('categories'));
});


app.get('/transactions', (req, res) => {
    res.json(db.get('transactions'));
});

app.post('/transactions', (req, res) => {
    const { items, userId, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in transaction' });
    }

    // Calculate total and deduct stock
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
        const product = db.findById('products', item.id);
        if (!product) {
            return res.status(404).json({ message: `Product ${item.id} not found` });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        db.update('products', product.id, { stock: product.stock - item.quantity });

        processedItems.push({
            productId: product.id,
            name: product.name,
            priceAtSale: product.price,
            quantity: item.quantity
        });

        totalAmount += product.price * item.quantity;
    }

    const transaction = {
        id: uuidv4(),
        date: new Date().toISOString(),
        userId,
        paymentMethod: paymentMethod || 'cash',
        totalAmount,
        items: processedItems
    };

    db.add('transactions', transaction);
    res.status(201).json(transaction);
});


app.get('/users', (req, res) => {
    const users = db.get('users').map(({ password, ...u }) => u);
    res.json(users);
});

app.get('/users/current', (req, res) => {

    const users = db.get('users');
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const { password, ...safeUser } = randomUser;
    res.json(safeUser);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
