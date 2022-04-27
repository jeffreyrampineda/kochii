#! /usr/bin/env node

console.log("This script populates some accounts, posts to your database.");
console.log("e.g.: node populatedb mongodb://localhost:27017/kochii");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const Post = require("../../models/post");
const Account = require("../../models/account");
const inventory_controller = require("../../controllers/inventory.controller");
const activity_controller = require("../../controllers/activity.controller");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
const fs = require("fs");
const path = require("path");

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () =>
  console.log("mongodb: connection established")
);

mongoose.connection.once("close", () =>
  console.log("mongodb: connection closed.")
);

const accounts = [];
const posts = [];

async function accountCreate(
  accountName,
  password,
  email,
  firstName,
  lastName,
  isVerified,
  verificationToken
) {
  const activity_id = mongoose.Types.ObjectId();
  const inventory_id = mongoose.Types.ObjectId();

  const accountDetail = {
    accountName,
    password,
    email,
    firstName,
    lastName,
    isVerified,
    verificationToken,
    inventory: inventory_id,
    activity: activity_id,
  };
  const account = await Account.create(accountDetail);

  const initActivityResult = await activity_controller.init(
    account._id,
    activity_id
  );
  const initInventoryResult = await inventory_controller.init(
    account._id,
    inventory_id
  );

  if (initActivityResult && initInventoryResult) {
    console.log("Account successfully created");
  }

  return account;
}

async function postCreate(
  title,
  author,
  tags,
  cooking_time,
  prep_time,
  calories,
  servings,
  ingredients,
  instructions,
  content,
  summary,
  likes,
  dislikes,
  banner
) {
  postdetail = {
    title,
    author,
    tags,
    cooking_time,
    prep_time,
    calories,
    servings,
    ingredients,
    instructions,
    content,
    summary,
    likes,
    dislikes,
    banner,
  };

  return await Post.create(postdetail);
}

async function createAccounts() {
  accounts.push(
    await accountCreate(
      "tester",
      "tester",
      "tester@tester.ca",
      "John",
      "Doe",
      true,
      "tester"
    )
  );

  console.log("Accounts created: ", accounts.length);
}

async function createPosts() {
  posts.push(
    await postCreate(
      "Grilled meat and veggies",
      accounts[0],
      ["Vegetables", "Meat"],
      "25 min",
      "35 min",
      441,
      4,
      [
        {
          name: "leaf lettuce",
          description: "torn into bite-size pieces",
          quantity: "1",
          unit_of_measurement: "head",
        },
        {
          name: "pears",
          description: "cored and chopped",
          quantity: "3",
          unit_of_measurement: "",
        },
        {
          name: "Roquefort cheese",
          description: "crumbled",
          quantity: "5",
          unit_of_measurement: "ounces",
        },
        {
          name: "avocado",
          description: "peeled, pitted, and diced",
          quantity: "1",
          unit_of_measurement: "",
        },
        {
          name: "green onions",
          description: "thinly sliced",
          quantity: "1/2",
          unit_of_measurement: "cup",
        },
        {
          name: "white sugar",
          description: "",
          quantity: "1/4",
          unit_of_measurement: "cup",
        },
        {
          name: "peacans",
          description: "",
          quantity: "1/2",
          unit_of_measurement: "cup",
        },
        {
          name: "olive oil",
          description: "",
          quantity: "1/3",
          unit_of_measurement: "cup",
        },
        {
          name: "red wine vinegar",
          description: "",
          quantity: "3",
          unit_of_measurement: "tablespoon",
        },
        {
          name: "white sugar",
          description: "",
          quantity: "1 1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "mustard",
          description: "",
          quantity: "1 1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "garlic",
          description: "clove, chopped",
          quantity: "1",
          unit_of_measurement: "",
        },
        {
          name: "salt",
          description: "",
          quantity: "1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "ground black pepper",
          description: "",
          quantity: "1",
          unit_of_measurement: "",
        },
      ],
      [
        "Soak rice for 4 hours. Drain rice and cook in a rice cooker with 2 cups of water. Rice must be slightly dry as vinegar will be added later.",
        "Immediately after rice is cooked, mix in 6 tablespoons rice vinegar to the hot rice. Spread rice on a plate until completely cool.",
        "Place 1 sheet of seaweed on bamboo mat, press a thin layer of cool rice on the seaweed. Leave at least 1/2 inch top and bottom edge of the seaweed uncovered. This is for easier sealing later. Dot some wasabi on the rice. Arrange cucumber, avocado and smoked salmon to the rice. Position them about 1 inch away from the bottom edge of the seaweed.",
        "Slightly wet the top edge of the seaweed. Roll from bottom to the top edge with the help of the bamboo mat tightly. Cut roll into 8 equal pieces and serve. Repeat for other rolls.",
      ],
      `
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, 
    dolorem impedit! Neque possimus sint, accusamus at repellat ipsam 
    dolore et voluptates, vel blanditiis magnam minus itaque dolor 
    doloribus autem necessitatibus.
    `,
      `
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, 
    dolorem impedit! Neque possimus sint, accusamus at repellat ipsam 
    dolore et voluptates, vel blanditiis magnam minus itaque dolor 
    doloribus autem necessitatibus.
    `,
      250,
      12,
      {
        data: fs.readFileSync(
          path.join(__dirname, "./grilled_meat_veggies.jpg")
        ),
        contentType: "image/jpg",
      }
    ),
    await postCreate(
      "Pork chop in the oven",
      accounts[0],
      ["Meat", "Pork"],
      "25 min",
      "15 min",
      241,
      6,
      [
        {
          name: "leaf lettuce",
          description: "torn into bite-size pieces",
          quantity: "1",
          unit_of_measurement: "head",
        },
        {
          name: "pears",
          description: "cored and chopped",
          quantity: "3",
          unit_of_measurement: "",
        },
        {
          name: "Roquefort cheese",
          description: "crumbled",
          quantity: "5",
          unit_of_measurement: "ounces",
        },
        {
          name: "avocado",
          description: "peeled, pitted, and diced",
          quantity: "1",
          unit_of_measurement: "",
        },
        {
          name: "green onions",
          description: "thinly sliced",
          quantity: "1/2",
          unit_of_measurement: "cup",
        },
        {
          name: "white sugar",
          description: "",
          quantity: "1/4",
          unit_of_measurement: "cup",
        },
        {
          name: "peacans",
          description: "",
          quantity: "1/2",
          unit_of_measurement: "cup",
        },
        {
          name: "olive oil",
          description: "",
          quantity: "1/3",
          unit_of_measurement: "cup",
        },
        {
          name: "red wine vinegar",
          description: "",
          quantity: "3",
          unit_of_measurement: "tablespoon",
        },
        {
          name: "white sugar",
          description: "",
          quantity: "1 1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "mustard",
          description: "",
          quantity: "1 1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "garlic",
          description: "clove, chopped",
          quantity: "1",
          unit_of_measurement: "",
        },
        {
          name: "salt",
          description: "",
          quantity: "1/2",
          unit_of_measurement: "teaspoon",
        },
        {
          name: "ground black pepper",
          description: "",
          quantity: "1",
          unit_of_measurement: "",
        },
      ],
      [
        "Soak rice for 4 hours. Drain rice and cook in a rice cooker with 2 cups of water. Rice must be slightly dry as vinegar will be added later.",
        "Immediately after rice is cooked, mix in 6 tablespoons rice vinegar to the hot rice. Spread rice on a plate until completely cool.",
        "Place 1 sheet of seaweed on bamboo mat, press a thin layer of cool rice on the seaweed. Leave at least 1/2 inch top and bottom edge of the seaweed uncovered. This is for easier sealing later. Dot some wasabi on the rice. Arrange cucumber, avocado and smoked salmon to the rice. Position them about 1 inch away from the bottom edge of the seaweed.",
        "Slightly wet the top edge of the seaweed. Roll from bottom to the top edge with the help of the bamboo mat tightly. Cut roll into 8 equal pieces and serve. Repeat for other rolls.",
      ],
      `
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, 
    dolorem impedit! Neque possimus sint, accusamus at repellat ipsam 
    dolore et voluptates, vel blanditiis magnam minus itaque dolor 
    doloribus autem necessitatibus.
    `,
      `
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, 
    dolorem impedit! Neque possimus sint, accusamus at repellat ipsam 
    dolore et voluptates, vel blanditiis magnam minus itaque dolor 
    doloribus autem necessitatibus.
    `,
      26,
      0,
      {
        data: fs.readFileSync(path.join(__dirname, "./pork_chop.jpg")),
        contentType: "image/jpg",
      }
    )
  );

  console.log("Posts created: ", posts.length);
}

createAccounts()
  .then(() => createPosts())

  // All done, disconnect from database
  .finally(() => mongoose.disconnect());
