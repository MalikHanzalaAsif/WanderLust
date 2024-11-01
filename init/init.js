const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
};
main()
.then(()=>{
    console.log('succesfully connected to mongodb database')
})
.catch((err)=>{
    console.log(`Cant connect to database ${err}`);
});

// WARNING! THIS DELETES ALL DATA FROM THE DATABASE FIRST!
async function addData() {
    try{
        await Listing.deleteMany({});
        console.log('deleted all data from database!');
        // initData.sampleListings = initData.sampleListings.map((obj) => {
        //     obj.owner = '671565fcc12fd54cf380ec53';
        //     obj.image = {
        //         url: obj.image,
        //         fileName: "listingimage"
        //     }
        //     return obj;
        // });
        // await Listing.insertMany(initData.sampleListings);
        // console.log('initialized data succesfully with images url!');

    }
     
    catch(err){
        console.log(err)
    }
};
addData();