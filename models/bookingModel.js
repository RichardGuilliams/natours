const mongoose = require('mongoose');

// Only use if we wish to Embed the User data into the Tour Model
// const User = require('./userModel');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking muse belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user']
    },
    price: {
        type: Number,
        required: [true, 'Booking must contain a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function(next){
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });

    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking

//POST /tour/23142j3khh23k/Bookings
//GET /tour/23142j3khh23k/Bookings
//GET /tour/23142j3khh23k/Bookings/124kjh124kj