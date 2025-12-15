
const router = require("express").Router();
const Movie = require("../models/Movie");
const {verifyToken, isAdmin} = require("../middleware/auth");

router.get("/", async(req,res)=>{
  const {page=1, limit=10} = req.query;
  const movies = await Movie.find()
    .skip((page-1)*limit)
    .limit(Number(limit));
  res.json(movies);
});

router.get("/search", async(req,res)=>{
  const q = req.query.q || "";
  res.json(await Movie.find({
    $or:[
      {title:{$regex:q,$options:"i"}},
      {description:{$regex:q,$options:"i"}}
    ]
  }));
});

router.get("/sorted", async (req, res) => {
  const sortBy = req.query.by;
  const sortMap = {
    name: "title",
    rating: "rating",
    releaseDate: "releaseDate",
    duration: "duration"
  };

  const movies = await Movie.find().sort(sortMap[sortBy]);
  res.json(movies);
});

router.post("/", verifyToken, isAdmin, async(req,res)=>{
  res.json(await Movie.create(req.body));
});

router.put("/:id", verifyToken, isAdmin, async(req,res)=>{
  res.json(await Movie.findByIdAndUpdate(req.params.id, req.body, {new:true}));
});

router.delete("/:id", verifyToken, isAdmin, async(req,res)=>{
  await Movie.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

module.exports = router;
