class Ticket {
 constructor(userId, eventId, seatCount, status = "confirmed") {
   this.userId = userId;
   this.eventId = eventId;
   this.seatCount = seatCount;
   this.status = status;
   this.bookedAt = new Date().toISOString();
 }


 toFirestore() {
   return {
     userId: this.userId,
     eventId: this.eventId,
     seatCount: this.seatCount,
     status: this.status,
     bookedAt: this.bookedAt
   };
 }
}
module.exports = Ticket;
