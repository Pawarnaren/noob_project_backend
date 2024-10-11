const router = require("express").Router();
const User = require("../models/user");
const Book=require("../models/book");
const jwt = require("jsonwebtoken");
const  { authenticateToken }=require("./userAuth");

router.post("/add-book", authenticateToken, async(req,res)=>{
    try{
        const { id }=req.headers;
        const user=await User.findById(id);
        if(user.role !== "admin")
        {
            res.status(400).json({
                message: "You are not having access to add the book"
            });
        }
        const book= new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        });

        await book.save();
        res.status(200).json({
            message:"Book Added Successfully"
        })
    }
    catch(error)
    {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

});

router.put("/update-book", authenticateToken, async(req,res)=>{
try{
    const {bookid} = req.headers;
    await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
    },{ new: true });

    return res.status(200).json({
        message:"Book Updated Successfully!!"
    });
}catch(error)
{
    return res.status(500).json("Internal Server Error");
}
});

router.delete("/delete-book", authenticateToken, async (req, res)=>{
    try{
        const { bookid }=req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message:"Book deleted Successfully"
        });
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            message: "An error occured"
        });
    }
});

router.get("/get-all-books", async (req,res)=>{
try{
    const books=await Book.find().sort({ createdAt: -1});
    return res.json({
        status:"Success",
        data:books
    });
}
catch(error)
{
    console.log(error);
        return res.status(500).json({
            message: "An error occured"
        });
}
});

router.get("/get-recent-books", async (req,res)=>{
    try{
        const books=await Book.find().sort({ createdAt: -1}).limit(4);
        return res.json({
            status:"Success",
            data:books
        });
    }
    catch(error)
    {
        console.log(error);
            return res.status(500).json({
                message: "An error occured"
            });
    }
    });

router.get("/get-book-by-id/:id", async(req,res)=>{
try{
    const {id}=req.params;
    const book= await Book.findById(id);
    return res.json({
        status:"Success",
        data: book,
    });
}catch(error)
{
    console.log(error);
        return res.status(500).json({
            message: "An error occured"
        });
}
});
module.exports= router;