const { Post } = require("../models");

// submit function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const submit = async function (p) {
  await p.save().catch((e) => e);
};

// get-all
const getAll = async function (p) {
  const recData = await p
  .find()
  .populate({ path: "author", select: ["-email", "-password"] })
  .populate({
    path: "comments",
    select: ["date", "comment"],
    populate: { path: "author", select: "username" },
  })
  .catch((error) => {
    return error;
  });
  return recData;
};

//get-one function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const getOne = async function (p, id) {
  const recData = await p
  .findOne(id)
  .populate({ path: "author", select: ["-email", "-password"] })
  .populate({
    path: "comments",
    select: ["date", "comment"],
    populate: { path: "author", select: "username" },
  })
  .catch((e) => {
    return e;
  });
  return recData;
};

//edit function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const edit = async function (model, base, replace) {
  const recData = await model
  .findOneAndUpdate(base, replace, { new: true })
  .populate({ path: "author", select: ["-email", "-password"] })
  .populate({
    path: "comments",
    select: ["date", "comment"],
    populate: { path: "author", select: "username" },
  })
  .catch((e) => {
    return e;
  });
  return recData;
};

//delete function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const destroy = async function (model, id) {
  const recData = await model.findByIdAndDelete(id).catch((e) => e);
  return recData;
};

//exports
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
module.exports = {
  submit, //takes one argument {Model}
  getAll, //takes one argument {Model}
  getOne, //takes two arguments {Model, _id}
  edit, //takes three arguments {Model, _id, replacement}
  Post,
  destroy,
};
