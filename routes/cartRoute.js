const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to cart
router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const inCart = userData.cart.includes(bookid);
    if (inCart) {
      return res.status(200).json({
        message: "Book is already added to the cart",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({
      message: "Book added to the cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

// Remove book from cart
router.put("/delete-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const inCart = userData.cart.includes(bookid);
    if (inCart) {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.status(200).json({
        message: "Book Removed from cart Successfully",
      });
    } else {
      return res.status(400).json({
        message: "Book is not present in cart",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Get user cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const userCart = userData.cart.reverse();
    return res.json({
      status: "Success",
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
