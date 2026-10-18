// src/controllers/authController.js
const { getFirestore } = require('firebase-admin/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const db = getFirestore();
const JWT_SECRET = "super_secret_kigali_key_123"; // In a real app, hide this in a .env file!


// --- API 1: REGISTER ---
exports.registerUser = async (req, res) => {
   try {
       const { fullName, email, password, role, gradeLevel } = req.body;


       // 1. Validation Bouncer
       if (!email || !password || !fullName || !role) {
           return res.status(400).json({ error: "Missing required fields" });
       }
       if (role !== "student" && role !== "parent") {
           return res.status(400).json({ error: "Role must be 'student' or 'parent'" });
       }


       // 2. Uniqueness Check
       const existingUser = await db.collection('users').where('email', '==', email).get();
       if (!existingUser.empty) {
           return res.status(409).json({ error: "Email already in use" });
       }


       // 3. The Shredder (Hash the password)
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);


       // 4. Use our Model to format the data cleanly
       const newUser = new User(fullName, email, hashedPassword, role, gradeLevel);


       // 5. Save to Firebase
       const docRef = await db.collection('users').add(newUser.toFirestore());


       res.status(201).json({ message: "Registration successful", userId: docRef.id });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};


// --- API 2: LOGIN ---
exports.loginUser = async (req, res) => {
   try {
       const { email, password } = req.body;


       // 1. Find the user by email
       const usersRef = await db.collection('users').where('email', '==', email).get();
       if (usersRef.empty) {
           return res.status(404).json({ error: "Invalid credentials" });
       }


       // Extract the user data and ID from Firebase
       const userDoc = usersRef.docs[0];
       const userData = userDoc.data();


       // 2. Compare the typed password with the shredded password in the database
       const isPasswordValid = await bcrypt.compare(password, userData.password);
       if (!isPasswordValid) {
           return res.status(401).json({ error: "Invalid password" });
       }


       // 3. Generate the VIP Wristband (JWT Token)
       const token = jwt.sign(
           { userId: userDoc.id, role: userData.role }, // The data hidden inside the token
           JWT_SECRET,
           { expiresIn: '2h' } // Token expires in 2 hours
       );


       // 4. Send the token to the user
       res.status(200).json({
           message: "Login successful",
           token: token,
           role: userData.role
       });


   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};
