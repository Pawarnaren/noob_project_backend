const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// add book to favorite
router.put("/add-book-to-favorite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isFavorite = userData.favorites.includes(bookid);
    if (isFavorite) {
      return res.status(200).json({
        message: "Book is already added to favorites",
      });}
      await User.findByIdAndUpdate(id, { $push: { favorites: bookid } });
      return res.status(200).json({
        message: "Book added to favorites"});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/delete-book-from-favorite", authenticateToken, async (req,res)=>{
    try{
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
    const isFavorite = userData.favorites.includes(bookid);
    if(isFavorite)
    {
        await User.findByIdAndUpdate(id, {$pull:{favorites: bookid}});
        return res.status(200).json({
            message:"Book Removed Successfully"
        });
    }
    else
    {
        return res.status(400).json({
            message:"Book is not present in favorites"
        });
    }
    }
    catch(error)
    {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/get-favorite-books", authenticateToken, async(req,res)=>{
try{
    const {id}= req.headers;
    // console.log(id);
    const userData= await User.findById(id).populate("favorites");
    const favoriteBooks=userData.favorites;
    // console.log(favoriteBooks);
    return res.json({
        status:"Success",
        data:favoriteBooks,
    });
}
catch(error)
{
    res.status(500).json({ message: "Internal Server Error" });
}
});
module.exports = router;
