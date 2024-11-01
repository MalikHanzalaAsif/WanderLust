const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review.js');
const { required } = require('joi');

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    description:{
        type:String
    },
    image:{
        url:{
            type: String,
            default:"https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
            set: function(val){
               return  val == "" || val == undefined ? "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg": val;
            }
        },
        fileName: String,
    },
    price:{
        type:Number,
        required:[true,'price is required']
    },
    location:{
        type:String,
        required:[true,'location is required']
    },
    country:{
        type:String,
        required:[true,'country is required']
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ geometry: { type: String } }`
          enum: ['Point'], // 'geometry.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    category: {
        type: String,
        enum: ['trending','rooms','iconicCities','mountains','castles','amazingPools','camping','farms','arctic','beach'],
        required: true
    }
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews} })
    }
});

const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;