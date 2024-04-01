const Issue = require("../../models/issue");
const BookUpload = require("../../models/book");
const IssueBook = require("../../models/issueBook");

const IssueBookToUser = async (req, res) => {
  const { Uid, Bid, ADid, subject, file } = req.body;

  await BookUpload.updateOne(
    { _id: Bid },
    { $inc: { NoOfItem: -1 } },
    { returnOriginal: false }
  );

  const UserData = await IssueBook.findOne({ UserId: Uid });

  if (UserData) {
    UserData.BookId.push({ Bid: Bid });
    const result = await UserData.save();
  } else {
    const IssueDoc = await IssueBook({
      UserId: Uid,
      BookId: { Bid: Bid },
    });
    await IssueDoc.save();
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).json({ message: "Successful" });
};

const ReturnBookUser = async (req, res) => {
  const { Uid, Bid } = req.body;

  const UpdatedBookData = await BookUpload.updateOne(
    { _id: Bid },
    { $inc: { NoOfItem: 1 } },
    { returnOriginal: false }
  );

  const IssueData = await IssueBook.findOne({ UserId: Uid });

  for (let i = 0; i < IssueData.BookId.length; i++) {
    if (IssueData.BookId[i].Bid.equals(Bid)) {
      IssueData.BookId.splice(i, 1);
      break;
    }
  }

  await IssueData.save();
  res.json({ message: "Success", Ret: true });
};

const GetAllBookUserData = async (req, res) => {
  const Uid = req.params.id;
  const data = await IssueBook.findOne({ UserId: Uid });

  let arr = [];
  if (data && data.BookId.length > 0) {
    for (let i = 0; i < data.BookId.length; i++) {
      const BookData = await BookUpload.findById({ _id: data.BookId[i].Bid });
      const newBookData = {
        Subject: BookData.Subject,
        file: BookData.file,
        BookId: BookData._id,
        UserId: Uid,
        issueDate: data.BookId[i].date,
      };
      arr.push(newBookData);
    }
    res.status(200).json({ book: arr });
  } else res.status(201).json({ book: "You don't have any issue book" });
};

module.exports = { IssueBookToUser, ReturnBookUser, GetAllBookUserData };
