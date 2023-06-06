const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address:[
        { type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    cart: [
        {
            product: {
                _id: { type: String, require: true },
                name: { type: String },
                price: { type: Number },
                banner: { type: String}
            },
          unit: { type: Number, require: true}
        }
    ],
    wishlist:[
        {
            _id: { type: String, require: true },
            name: { type: String },
            description: { type: String },
            price: { type: Number },
            available: { type: Boolean },
            banner: { type: String}
        }
    ],
    orders: [ 
        {
            _id: { type: String, require: true },
            amount: { type: String },
            date: {type: Date, default: Date.now},
        }
    ]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports =  mongoose.model('customer', CustomerSchema);