const express = require('express');


// 1. Bring in the specific tools we need from the updated firebase-admin library
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');


// 2. Load the VIP keys
const serviceAccount = require('./firebase-keys.json');


// 3. Turn the keys in the ignition using the new 'cert' function
initializeApp({
    credential: cert(serviceAccount)
});


// 4. Get the database connection
const db = getFirestore();
const app = express();


// Teach the server how to read JSON data
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello")
})


// ... (Your app.post routes go here, exactly as they were) ...

// Import our new routes
const authRoutes = require('./scr/routes/authRoute');

// Tell the server to send any traffic starting with /api/auth to our Waiter
app.use('/api/auth', authRoutes);


app.listen(3000, () => {
    console.log('Kitchen Manager is awake and listening on Port 3000');
});
