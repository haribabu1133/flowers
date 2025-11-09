const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// Route for root to serve index.html
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// File paths for data storage
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Helper functions to read/write JSON files
function readJSONFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// Flower data
const flowers = [
  { id: 1, name: 'Tulips', price: 1299, description: 'Vibrant spring blooms', image: 'https://images.pexels.com/photos/1028980/pexels-photo-1028980.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 2, name: 'Daffodils', price: 1099, description: 'Cheerful yellow flowers', image: 'https://images.pexels.com/photos/67857/daisy-flower-spring-marguerite-67857.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 3, name: 'Sweet Peas', price: 1199, description: 'Delicate and fragrant', image: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=800' },
  { id: 4, name: 'Lilac', price: 1499, description: 'Purple clusters of beauty', image: 'https://images.pexels.com/photos/459046/pexels-photo-459046.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 5, name: 'Anemones', price: 1399, description: 'Exotic and elegant', image: 'https://images.pexels.com/photos/158465/waterlily-pink-water-lily-water-plant-158465.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 6, name: 'Gerbera Daisies', price: 999, description: 'Bright and colorful', image: 'https://images.pexels.com/photos/1233442/pexels-photo-1233442.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 7, name: 'Cherry Blossoms', price: 1599, description: 'Symbol of renewal', image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 8, name: 'Lavender', price: 1249, description: 'Calming purple hues', image: 'https://images.pexels.com/photos/5766885/pexels-photo-5766885.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 9, name: 'Poppies', price: 1349, description: 'Bold red petals', image: 'https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 10, name: 'Magnolias', price: 1799, description: 'Large and fragrant', image: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 11, name: 'Red Roses', price: 1499, description: 'Classic symbol of love and romance', image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 12, name: 'Spring Tulips', price: 1299, description: 'Colorful spring favorites', image: 'https://images.pexels.com/photos/1028980/pexels-photo-1028980.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 13, name: 'Sunflowers', price: 999, description: 'Bright and cheerful blooms', image: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=800' },
  { id: 14, name: 'White Orchids', price: 1799, description: 'Elegant and sophisticated', image: 'https://images.pexels.com/photos/459046/pexels-photo-459046.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 15, name: 'Purple Lilies', price: 1399, description: 'Majestic and fragrant blooms', image: 'https://images.pexels.com/photos/158465/waterlily-pink-water-lily-water-plant-158465.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 16, name: 'Pink Peonies', price: 1699, description: 'Luxurious and romantic', image: 'https://images.pexels.com/photos/1233442/pexels-photo-1233442.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 17, name: 'Fresh Daisies', price: 899, description: 'Pure and innocent beauty', image: 'https://images.pexels.com/photos/67857/daisy-flower-spring-marguerite-67857.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 18, name: 'Blue Hydrangeas', price: 1349, description: 'Beautiful clusters of color', image: 'https://images.pexels.com/photos/5766885/pexels-photo-5766885.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 19, name: 'Red Carnations', price: 1199, description: 'Long-lasting beauty', image: 'https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

// API Routes

// Get all flowers
app.get('/api/flowers', (req, res) => {
  res.json(flowers);
});

// Place order
app.post('/api/orders', (req, res) => {
  const { fullName, email, phone, address, deliveryDateTime, specialInstructions, cart: orderCart } = req.body;

  if (!fullName || !email || !phone || !address || !deliveryDateTime || !orderCart || orderCart.length === 0) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const orders = readJSONFile(ORDERS_FILE);
  const order = {
    id: Date.now().toString(),
    fullName,
    email,
    phone,
    address,
    deliveryDateTime,
    specialInstructions: specialInstructions || '',
    items: orderCart,
    total: orderCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  writeJSONFile(ORDERS_FILE, orders);
  res.json({ message: 'Order placed successfully', orderId: order.id, order });
});

// Get orders (for admin purposes)
app.get('/api/orders', (req, res) => {
  const orders = readJSONFile(ORDERS_FILE);
  // Sort by createdAt descending
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const contacts = readJSONFile(CONTACTS_FILE);
  const contact = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    message,
    submittedAt: new Date().toISOString()
  };

  contacts.push(contact);
  writeJSONFile(CONTACTS_FILE, contacts);
  res.json({ message: 'Thank you for your message! We will get back to you soon.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
