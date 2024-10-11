const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        if (!order || order.length === 0) {
            return res.status(400).json({ message: "Order data is missing or empty" });
        }

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            // Saving Order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id },
            });

            // Clearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }

        return res.json({
            status: "Success",
            message: "Order Placed Successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
});


router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is missing in headers" });
        }

        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {
                path: "book"
            }
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const orderData = userData.orders.reverse();

        return res.json({
            status: "Success",
            data: orderData,
        });
    } catch (error) {
        console.error("Error fetching order history:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

router.get("/get-all-orders", authenticateToken, async(req,res)=>{
    try
    {
        const userData= await Order.find().populate({
            path:"book"
        }).populate({
            path:"user"
        }).sort({createdAt:-1});

        return res.json({
            status: "Success",
            data:userData
        });
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message: "An error occured"
        });
    }
});

//Order Id
router.put("/update-status/:id", authenticateToken, async (req,res)=>{
    try{
    const {id}= req.params;
    await Order.findByIdAndUpdate(id,{status: req.body.status});

    return res.json({
        status:"Success",
        message: "Status updated Successfully",
    });
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message: "An error occured"
        });
    }
})
module.exports = router;