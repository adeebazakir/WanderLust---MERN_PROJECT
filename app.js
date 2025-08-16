const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override")
const ejs_mate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main().then( () =>{
        console.log("connected to DB")
    })
    .catch((err) =>{
        console.log(err)
    })

async function main(){
    await mongoose.connect(MONGO_URL);

}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejs_mate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi i am root");
})


app.get("/listings",async(req,res) =>{

    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    });

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id",async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings", async(req,res) =>
{
    //let listing=req.body.listing;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    console.log(listing);
})


//Edit Route
app.get("/listings/:id/edit", async (req,res) =>
{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})


//Update Route
app.put("/listings/:id",async (req,res) =>
{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async (req,res) =>
{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Delete the listing with id - ",deletedListing);
    res.redirect("/listings");

})

// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing ({
//         title : "My new Villa",
//         description: "By the Beach",
//         price: 3000,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful test..")
// })

app.listen(3000,() =>{
    console.log("Server is running on port 3000");
})