class Event {
   constructor(title, date, totalSeats, venue) {
       this.title = title;
       this.date = date;
       this.totalSeats = totalSeats;
       this.venue = venue;
       this.availableSeats = totalSeats;
       this.createdAt = new Date().toISOString();
   }
   toFireStore() {
       return {
           title: this.title,
           date: this.date,
           totalSeats: this.totalSeats,
           venue: this.venue,
           availableSeats: this.availableSeats,
           createdAt: this.createdAt
       }
   }
}
module.exports = Event;
