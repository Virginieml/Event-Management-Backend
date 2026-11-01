const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const Ticket = require('../models/Ticket');


const db = getFirestore();


exports.createTicket = async (req, res) => {
   try {
       const { userId, eventId, seatCount } = req.body;


       if (!userId || !eventId || !seatCount) {
           return res.status(400).json({ error: "Missing required ticket details" });
       }


       const userDoc = await db.collection('users').doc(userId).get();
       if (!userDoc.exists) {
           return res.status(404).json({ error: "User not found" });
       }


       const eventRef = db.collection('events').doc(eventId);
       const eventDoc = await eventRef.get();


       if (!eventDoc.exists) {
           return res.status(404).json({ error: "Event not found" });
       }


       if (eventDoc.data().availableSeats < seatCount) {
           return res.status(400).json({ error: "Not enough seats available" });
       }


       const newTicket = new Ticket(userId, eventId, seatCount);
       const ticketRef = await db.collection('tickets').add(newTicket.toFirestore());


       await eventRef.update({
           availableSeats: FieldValue.increment(-seatCount)
       });


       res.status(201).json({ message: "Ticket Created & Seats Deducted!", ticketId: ticketRef.id });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};


exports.getAllTickets = async (req, res) => {
 try {
   const ticketsSnapshot = await db.collection('tickets').get();
   const ticketsList = [];
  
   ticketsSnapshot.forEach((doc) => {
     ticketsList.push({ id: doc.id, ...doc.data() });
   });


   res.status(200).json(ticketsList);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


exports.getTicketsByUserId = async (req, res) => {
 try {
   const userId = req.params.userId;
   const ticketsSnapshot = await db.collection('tickets').where('userId', '==', userId).get();
  
   if (ticketsSnapshot.empty) {
     return res.status(404).json({ message: "No tickets found for this user" });
   }


   const ticketsList = [];
   ticketsSnapshot.forEach((doc) => {
     ticketsList.push({ id: doc.id, ...doc.data() });
   });


   res.status(200).json(ticketsList);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


exports.updateTicket = async (req, res) => {
 try {
   const ticketId = req.params.id;
   const updatedData = req.body;
  
   const ticketRef = db.collection('tickets').doc(ticketId);
   await ticketRef.update(updatedData);
  
   res.status(200).json({ message: "Ticket successfully updated!" });
 } catch (error) {
   res.status(500).json({ error: "Could not update. Make sure the ID is correct." });
 }
};


exports.deleteTicket = async (req, res) => {
 try {
   const ticketId = req.params.id;
   await db.collection('tickets').doc(ticketId).delete();
  
   res.status(200).json({ message: "Ticket successfully deleted!" });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};
