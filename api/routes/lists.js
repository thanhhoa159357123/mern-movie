const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//create
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      return res.status(201).json(savedList);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});

//detele
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      return res.status(201).json("The list has been deleted...");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});
//get

router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } }, // Lọc theo type và genre
          { $sample: { size: 10 } },
        ]);
      } else {
        list = await List.aggregate([
          { $match: { type: typeQuery } }, // Chỉ lọc theo type
          { $sample: { size: 10 } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]); // Lấy mẫu 10 phim bất kỳ
    }
    return res.status(200).json(list);
  } catch (err) {
    console.error("Error while fetching list:", err); // In lỗi chi tiết cho debug
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách phim", error: err });
  }
});

module.exports = router;
