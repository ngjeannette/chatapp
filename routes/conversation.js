const router = require("express").Router();
let Conversation = require("../models/conversation.model");

// 1) find conversation history so GET
router.route("/selectedconvo").get((req, res) => {
  const {
    query: { to, from },
  } = req;
  Conversation.find({
    $or: [
      { to: req.query.to, from: req.query.from },
      { to: req.query.from, from: req.query.to },
    ],
  })
    .then((conversation) => {
      return res.json(conversation);
    })
    .catch((err) => res.status(400).json("errorGET" + err));
  // Conversation.find({to, from})
});

router.route("/addconversation").post((req, res) => {
  const {
    body: { to, from, chatHistory, read },
  } = req;
  const newConversation = new Conversation({
    to,
    from,
    read,
    chatHistory,
  });
  newConversation
    .save()
    .then(() => res.json("conversation added"))
    .catch((err) => res.status(400).json("errorADDCONVERSATOIN" + err));
});

// aggreate -> match to/from user -> group to/from into a set -> filter combine to/from -> condition of NOT EQUAL to user.
router.route("/friends").get((req, res) => {
  const {
    query: { user },
  } = req;
  return Conversation.aggregate([
    {
      $match: { $or: [{ to: user }, { from: user }] },
    },
    {
      $group: {
        _id: null,
        to: { $addToSet: "$to" },
        from: { $addToSet: "$from" },
      },
    },
    {
      $project: {
        _id: 0,
        friends: {
          $filter: {
            input: { $setUnion: ["$to", "$from"] },
            as: "friend",
            cond: { $ne: ["$$friend", user] },
          },
        },
      },
    },
  ])
    .then((response) => {
      const [{ friends }] = response;
      return Promise.all(
        friends.map((friend) =>
          Conversation.find({ to: user, from: friend, read: false }).count()
        )
      ).then((counts) =>
        counts.map((count, i) => ({ friend: friends[i], unread: count }))
      );
    })
    .then((result) => res.json(result))
    .catch((err) => res.status(404).json(err + "jsonerrer"));
});

// find all the false and change to true
router.route("/updateunread").post((req, res) => {
  const {
    body: { to, from },
  } = req;
  Conversation.updateMany(
    { to: req.body.from, from: req.body.to, read: false },
    { $set: { read: true } }
  )
    .then((conversation) => {
      return res.json(conversation);
    })
    .catch((err) => res.status(400).json("errorGET" + err));
});

// remove all documents
router.route("/removeconversation").post((req, res) => {
  Conversation.remove({})
    .then((conversation) => {
      return res.json(conversation);
    })
    .catch((error) => {
      console.log(error, "error");
    });
});

module.exports = router;
