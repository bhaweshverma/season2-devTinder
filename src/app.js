const express = require("express");
const PORT = "3000";
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173", // React app URL
  methods: "GET, POST, PATCH",
  credentials: true,
};
// instance of app
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// routers - runs in the order defined
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log(`DB is connected successfully!`);
    app.listen(PORT, () => {
      console.log("Server is up and running at PORT - ", PORT);
    });
  })
  .catch((error) => {
    //console.log(error.message);
    console.log(`DB did not get connected!`);
  });

/* Below commented code is for learning, it is a demo code. Please READ.*/
/*
// find user by email
app.get("/user", async (req, res) => {
  const email = req.body.email;

  try {
    let response = await User.findOne({ email: email });
    if (!response) {
      res.status(404).send("User not found!");
    } else {
      res.send(response);
    }
  } catch (e) {
    res.send("User not found!");
  }
});

// get all users - feed
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (e) {
    res.status(500).send("something went wrong");
  }
});

// delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User is deleted!");
  } catch (e) {
    res.status(500).send("something went wrong!");
  }
});

// update user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // API Validation - for no email update
    const ALLOWED_VALUES = [
      "photoUrl",
      "about",
      "skills",
      "age",
      "firstName",
      "lastName",
      "password",
    ];
    const isAllFieldsValid = Object.keys(data).every((val) =>
      ALLOWED_VALUES.includes(val)
    );

    if (!isAllFieldsValid) {
      throw new Error("invalid field update");
    }

    if (data?.skills.length > 10) {
      throw new Error("cannot add more than 10 skills");
    }
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send(updatedUser);
  } catch (error) {
    //console.log(JSON.stringify(error));
    res.status(500).send(error.message + " : " + error?.errors?.gender?.value);
  }
});

// update user with Id
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "before",
//       runValidators: true,
//     });

//     res.send(updatedUser);
//   } catch (error) {
//     res.status(500).send("INVALID DATA: " + error.message);
//   }
// });
*/

/*
// Snippet 5
// auth middleware
app.use("/admin", adminAuth);

//app.use("/user", userAuth);
app.get("/user/login", (req, res) => {
  res.send("No auth required, user is logged-in successfully!");
});

// Snippet 6
// app.get("/user", (req, res) => {
//   // Logic to call DB and fetch data
//   throw new Error("error thrown!");
//   res.send("It will never run!");
// });

// if not handled here then will go to app.use
app.get("/user", (req, res) => {
  try {
    // Logic to call DB and fetch data
    throw new Error("error thrown!");
    res.send("It will never run!");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
// Error Handling Middleware
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong.");
  }
});

// Snippet 6 - handling the userAuth in single app.get
// app.get("/user", userAuth, (req, res) => {
//   res.send("User details sent!");
// });

app.get("/admin/getAllUsers", (req, res, next) => {
  res.send("Data sent for all users!");
});

app.post("/admin/user", (req, res, next) => {
  res.send("User added!");
});

app.delete("/admin/user", (req, res, next) => {
  res.send("User deleted!");
});


// callback is called as Route handler function
// for GET, POST, DELETE /user calls, this will always run as order matters
// app.use("/user", (req, res) => {
//   res.send("Hello from Server!");
// });

// "/ab?c" -> /abc, /ac -> as b is optional
// "ab+c" -> /abc, /abbbc, /abbbbbbbbbbbbbbbbbbc -> as many as b can be added between a & c
// /ab*cd -> /abcd, /abBHAWESHcd, /abVERMAAAAAAAAcd -> anything between ab & cd will work due to *
// regex -> /.*fly$/  is also accepted

// app.get("/user", (req, res) => {
//   res.send({ firstName: "Bhawesh", lastName: "Verma" });
// });

// app.post("/user", (req, res) => {
//   res.send("User is added successfully!");
// });

// app.delete("/user", (req, res) => {
//   res.send("User is deleted successfully!");
// });

// Snippet 1
app.get(
  "/user",
  (req, res, next) => {
    console.log("1 Route Handler!!");
    res.send({ firstName: "Bhawesh", lastName: "Verma" });
    next();
  },
  (req, res, next) => {
    console.log("2 Route Handler!!");
    res.send({ firstName: "Bhawesh", lastName: "Verma" });
  }
);

// Snippet 2
app.get(
  "/user",
  (req, res, next) => {
    console.log("1 Route Handler!!");
    //res.send({ firstName: "Bhawesh", lastName: "Verma" });
    next();
  },
  (req, res, next) => {
    console.log("2 Route Handler!!");
    //res.send({ firstName: "Bhawesh", lastName: "Verma" });
    //next();
  }
);

// Snippet 3 - With multiple Route Handlers
const rh1 = (req, res, next) => {
  console.log("RH1");
  next();
};
const rh2 = (req, res, next) => {
  console.log("RH2");
  next();
};
const rh3 = (req, res, next) => {
  console.log("RH3");
  //next();
};
const rh4 = (req, res, next) => {
  console.log("RH4");
  next();
};
const rh5 = (req, res, next) => {
  console.log("RH5");
  res.send("Sending response from route handler 5!");
  next();
};

// can pass the router handlers as inline or as arrays or both/mix
app.use("/user", rh1, [rh2, rh3], [rh4], rh5);

// Snippet 4 - Multiple app.use works in same fashion as multiple RHs in single app.use or app.get
app.use("/user", (req, res, next) => {
  console.log("RH1");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("RH2");
  //res.send("Hello");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("RH3");
  //res.send("Hello 2");
  // next();
});
*/
