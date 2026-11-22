const { getFirestore } = require('firebase-admin/firestore');
const Event = require('../models/Event');


const db = getFirestore();


exports.createEvent = async (req, res) => {
   try {
       const { title, date, totalSeats, venue } = req.body;
       // Validation
       if (!title || !date || !totalSeats || !venue) {
           return res.status(400).json({ error: "Missing required fields" });
       }
       const newEvent = new Event(title, date, totalSeats, venue);
       const docRef = await db.collection('events').add(newEvent.toFireStore());
       res.status(201).json({ message: "Event created successfully", eventId: docRef.id });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}


exports.getAllEvents = async (req, res) => {
   try {
       const eventsSnapshot = await db.collection('events').get();
       const eventsList = [];


       eventsSnapshot.forEach((doc) => {
           eventsList.push({ id: doc.id, ...doc.data() });
       });


       res.status(200).json(eventsList);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};


exports.getEventByName = async (req, res) => {
   try {
       const title = req.params.title;
       const eventsSnapshot = await db.collection('events').where('title', '==', title).get();


       if (eventsSnapshot.empty) {
           return res.status(404).json({ error: "No events found with that name" });
       }


       const eventsList = [];
       eventsSnapshot.forEach((doc) => {
           eventsList.push({ id: doc.id, ...doc.data() });
       });


       res.status(200).json(eventsList);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
} 
exports.getEventById = async (req, res) => {
   try {
   const { id } = req.params;
   const doc = await db.collection("events").doc(id).get();


   if (!doc.exists) {
     return res.status(404).json({ message: "Event not found" });
   }


   res.status(200).json({ id: doc.id, ...doc.data() });
 } catch (error) {
   res.status(500).json({ message: "Failed to fetch event", error: error.message });
 }
};

exports.updateEvent = async (req, res) => {
   try {
       const eventId = req.params.id;
       const updatedData = req.body;


       const eventRef = db.collection('events').doc(eventId);
       await eventRef.update(updatedData);


       res.status(200).json({ message: "Event successfully updated!" });
   } catch (error) {
       res.status(500).json({ error: "Could not update. Make sure the ID is correct." });
   }
};

exports.deleteEvent = async (req, res) => {
   try {
       const eventId = req.params.id;
       await db.collection('events').doc(eventId).delete();


       res.status(200).json({ message: "Event successfully deleted!" });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

