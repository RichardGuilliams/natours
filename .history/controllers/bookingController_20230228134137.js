const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)/*(process.env.STRIPE_SECRET_KEY)*/;
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour =  await Tour.findById(req.params.tourId);
  
  // 2) Configure item data for stripe
  const transformedItems = [
    {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: tour.price * 100,
        product_data: {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [`${req.protocol}://${req.get()}/img/tours/${tour.imageCover}`],
        },
      },
    },
  ];
  
  // 3) Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: transformedItems,
    
    mode: 'payment',
  });

  // 3) Send session as response to the client
  res.status(200).json({
    status: 'success',
    session
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // 1) Deconstruct the query to extract booking information
//   const { tour, user, price } = req.query;
  
//   // 2) Skip function if any data is missing
//   if(!tour || !user || !price) return next();

//   // 3) Create a new booking
//   await Booking.create({ tour, user, price });

//   // 4) Redirect client to the original url
//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email})).id;
  const price = session.line_items[0].amount / 100;
  await Booking.create({ tour, user, price});
};

exports.webhookCheckout = (req, res, next) => {
  // 1) Get Stripe Signature
  console.log(req.headers);
  const signature = req.headers['stripe-signature'];

  // 2) declare event then add relevant data
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

  res.status(200).json({ 
    received: true 
  });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);