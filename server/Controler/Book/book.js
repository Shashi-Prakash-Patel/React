const BookUpload = require("../../models/book");

const UploadBook = async (req, res) => {
  const { subject, author, edition, price, item } = req.body;
  const file = req.file.filename;
  console.log(req.body);

  const book = new BookUpload({
    Subject: subject,
    Author: author,
    NoOfItem: item,
    Price: price,
    Edition: edition,
    file: file,
  });

  await book.save();
  res.status(200).json({ message: "Success" });
};

const GetAllBookData = async (req, res) => {
  const BookData = await BookUpload.find({});
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader("Access-Control-Allow-Origin", "https://react-phi-coral.vercel.app");
  res.status(200).json({ book: BookData });
};

const GetOneBookData = async (req, res) => {
  const BookData = await BookUpload.findById({ _id: req.params.id });

  res.status(200).json({ book: BookData });
};

module.exports = { UploadBook, GetAllBookData, GetOneBookData };
