const express = require('express');
const router = express.Router();
const eventcontroller = require('../controllers/eventController');

router.post('/create', eventcontroller.createEvent);
router.get('/all', eventcontroller.getAllEvents);
router.get('/:title', eventcontroller.getEventByName);
router.put('/:id', eventcontroller.updateEvent);
router.delete('/:id', eventcontroller.deleteEvent);
module.exports = router;