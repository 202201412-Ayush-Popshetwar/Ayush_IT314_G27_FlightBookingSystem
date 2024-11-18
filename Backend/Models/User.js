import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4, // Minimum 4 characters for name
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique in the database
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum 6 characters for password
  },
  phoneNumber: { type: String, match: /^[0-9]{10}$/ }, 
  address: String,
  passengers: [
    {
      designation: { type: String,  },
      firstName: { type: String,  },
      lastName: { type: String,  },
      dob: { type: Date,  },
      phone: { type: String, match: /^[0-9]{10}$/ }, // Ensures 10-digit phone number
    },
  ],
  // Array of booking IDs referencing the Bookings collection
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bookings' }],
});

// Booking Schema definition
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'flights' },
  from: String,
  to: String,
  date: Date,
  class: String,
  passengers: Number,
  status: String,
  price: Number,
});


// Airport Schema definition
const AirportSchema = new mongoose.Schema({
  name: {type: String,required: true,unique:true},
});

//flight schema definition
const flightSchema = new mongoose.Schema({
  flight_date: { type: String, required: true },
  airline: { type: String, required: true },
  flight_num: { type: String, required: true },
  class: { type: String, required: true, enum: ['economy', 'business', 'first'] },
  from: { type: String, required: true },
  dep_time: { type: String, required: true },
  to: { type: String, required: true },
  arr_time: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  stops: { type: String, required: true }
});


// Models
 const UserModel = mongoose.model('users', UserSchema);
 const BookingModel = mongoose.model('bookings', BookingSchema);
 const AirportModel = mongoose.model('Airport', AirportSchema);
const FlightModel = mongoose.model('Flight', flightSchema);

export  { UserModel, BookingModel, AirportModel, FlightModel };
