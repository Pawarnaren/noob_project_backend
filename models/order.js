const mongoose=require("mongoose");

const order= new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "user",
    },

    book:{
        type:mongoose.Types.ObjectId,
        ref:"book",
    },
    status:
    {
        type:String,
        default:"Order Placed",
        enum:["Order Placed", "Out for delivery", "Deliverd", "Canceled"],
    },

},
//To arrange order in accordance with the time it is ordered 
{timestamps:true});

module.exports=mongoose.model("order",order);