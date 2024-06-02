import { Router } from "express";
import bcrypt from "bcryptjs";
import xml2js from "xml2js";
import { v4 as uuid4 } from "uuid";
import * as Users from "../models/users.js";
import auth from "../middleware/auth.js";
import validator from "validator";

const userController = Router();

userController.post("/login", async (req, res) => {
  let loginData = req.body;

  // Data format validation
  if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(loginData.email)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid email address.",
    });
  }

  // TODO: Done on purpose for now for simple login with abc123 password.
  // if (
  //   !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
  //     loginData.password
  //   )
  // ) {
  //   return res.status(422).json({
  //     status: 422,
  //     message:
  //       "Password must be at least 6 characters long and contain at least one digit,
  // one lowercase letter (a-z), and one uppercase letter.",
  //   });
  // }

  Users.getByEmail(loginData.email)
    .then((user) => {
      if (bcrypt.compareSync(loginData.password, user.password)) {
        // generates a new authentication key for the user upon successful login
        user.authentication_key = uuid4().toString();

        Users.update(user).then((result) => {
          res.status(200).json({
            status: 200,
            message: "User logged in",
            authentication_key: user.authentication_key,
          });
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Invalid credentials",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Login failed",
      });
    });
});

userController.post("/logout", (req, res) => {
  const authenticationKey = req.get("X-AUTH-KEY");
  Users.getByAuthenticationKey(authenticationKey)
    .then((result) => {
      result.authentication_key = null;
      Users.update(result).then((user) => {
        res.status(200).json({
          status: 200,
          message: "User has been logged out successfully.",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to log user out.",
      });
    });
});

userController.post("/registration", async (req, res) => {
  const userData = req.body;

  const userAlreadyExists = await Users.getByEmail(userData.email);

  if (userAlreadyExists) {
    res.status(409).json({
      status: 409,
      message:
        "The provided email address is already associated with another account. Please try again.",
    });
    return;
  }

  // Data format validation
  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.first_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and must start with a capital letter.",
    });
  }

  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.last_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and ,must start with a capital letter.",
    });
  }

  if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(userData.email)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid email address.",
    });
  }

  if (
    !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
      userData.phone
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid phone number. Please enter a valid Australian phone number.",
    });
  }

  if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
      userData.password
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Password must be at least 6 characters long and contain at least one digit, one lowercase letter (a-z), and one uppercase letter.",
    });
  }

  // hash the password
  userData.password = bcrypt.hashSync(userData.password);

  // Convert the user data into a User model object
  const user = Users.newUser(
    null,
    validator.escape(userData.first_name),
    validator.escape(userData.last_name),
    validator.escape(userData.email),
    userData.password,
    validator.escape(userData.phone),
    "member",
    null,
    null
  );

  // Use the create model function to insert this user into the db

  Users.create(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Registration successful.",
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Registration failed.",
      });
    });
});

userController.get("/", async (req, res) => {
  const users = await Users.getAll();
  if (!users) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all users",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all users",
      users,
    });
  }
});

userController.get("/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID",
    });
  }

  Users.getByID(userID)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved user by ID",
        user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve user by ID",
      });
    });
});

userController.get("/authentication/:authenticationKey", (req, res) => {
  const authenticationKey = req.params.authenticationKey;

  Users.getByAuthenticationKey(authenticationKey)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Get user by authentication key",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get user by authentication key",
      });
    });
});

userController.post("/", async (req, res) => {
  const userData = req.body;

  const userAlreadyExists = await Users.getByEmail(userData.email);

  if (userAlreadyExists) {
    res.status(409).json({
      status: 409,
      message:
        "The provided email address is already associated with another account. Please try again.",
    });
    return;
  }

  // Data format validation
  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.first_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and ,must start with a capital letter.",
    });
  }

  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.last_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and ,must start with a capital letter.",
    });
  }

  if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(userData.email)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid email address format.",
    });
  }

  if (
    !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
      userData.phone
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid phone number. Please enter a valid Australian phone number.",
    });
  }

  if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
      userData.password
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Password must be at least 6 characters long and contain at least one digit, one lowercase letter (a-z), and one uppercase letter.",
    });
  }

  if (!/^[A-Za-z]+$/.test(userData.role)) {
    return res.status(422).json({
      status: 422,
      message: "The user's role can only container letters",
    });
  }

  // if the password isn't already hashed, hash the password.
  if (userData.password && !userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  const user = Users.newUser(
    null,
    validator.escape(userData.first_name),
    validator.escape(userData.last_name),
    validator.escape(userData.email),
    userData.password,
    validator.escape(userData.phone),
    validator.escape(userData.role),
    null,
    null
  );

  // Use the create model function to insert the user into the database
  Users.create(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Successfully created a new user",
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create new user",
      });
    });
});

userController.post("/xml-upload", auth(["admin", "trainer"]), (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a String
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up the XML Parser
    const parser = new xml2js.Parser();
    parser
      .parseStringPromise(file_text)
      .then((data) => {
        const memberUpload = data["members-upload"];
        const memberUploadAttributes = memberUpload["$"];
        const operation = memberUploadAttributes["operation"];
        const membersData = memberUpload["members"][0]["member"];

        if (operation == "insert") {
          Promise.all(
            membersData.map((memberData) => {
              memberData.password = memberData
                ? memberData.password.toString()
                : "";

              if (
                memberData.password &&
                !memberData.password.startsWith("$2a")
              ) {
                memberData.password = bcrypt.hashSync(memberData.password);
              }

              // Convert the xml object into a model object
              const memberModel = Users.newUser(
                null,
                validator.escape(memberData.first_name.toString()),
                validator.escape(memberData.last_name.toString()),
                validator.escape(memberData.email.toString()),
                memberData.password,
                validator.escape(memberData.phone.toString()),
                validator.escape(memberData.role.toString()),
                null,
                null
              );
              // Return the promise of each creation query
              return Users.create(memberModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload insert was successful.",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: `XML upload failed on database operation: ${error}`,
              });
            });
        } else if (operation == "update") {
          Promise.all(
            membersData.map((memberData) => {
              // Convert the xml object into a model object
              const memberModel = Users.newUser(
                memberData.id.toString(),
                memberData.first_name.toString(),
                memberData.last_name.toString(),
                memberData.email.toString(),
                memberData.password.toString(),
                memberData.phone.toString(),
                memberData.role.toString(),
                null,
                null
              );
              // Return the promise of each creation query
              return Users.update(memberModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload update was successful.",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: `XML upload update failed on database operation: ${error}`,
              });
            });
        } else {
          res.status(400).json({
            status: 400,
            message: "XML contains invalid operation attribute value",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Error parsing XML: ${error}`,
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "No file was selected",
    });
  }
});

userController.patch("/:id", async (req, res) => {
  // Get the user data out of the request
  const userID = req.params.id;
  const userData = req.body.user;

  // Data format validation
  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.first_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and ,must start with a capital letter.",
    });
  }

  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.last_name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. Names can only contain letters and ,must start with a capital letter.",
    });
  }

  if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(userData.email)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid email address format.",
    });
  }

  if (
    !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
      userData.phone
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid phone number. Please enter a valid Australian phone number.",
    });
  }

  if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
      userData.password
    )
  ) {
    return res.status(422).json({
      status: 422,
      message:
        "Password must be at least 6 characters long and contain at least one digit, one lowercase letter (a-z), and one uppercase letter.",
    });
  }

  if (!/^[A-Za-z]+$/.test(userData.role)) {
    return res.status(422).json({
      status: 422,
      message: "The user's role can only container letters",
    });
  }

  // Use the ID passed in the URL parameters to avoid ambiguity between
  // the logged in user's auth key and the updated user's auth key
  userData.id = userID;

  // if the password isn't already hashed, hash the password.
  if (userData.password && !userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  // Convert the user data into a User model object
  const user = Users.newUser(
    userData.id,
    validator.escape(userData.first_name),
    validator.escape(userData.last_name),
    validator.escape(userData.email),
    userData.password,
    validator.escape(userData.phone),
    validator.escape(userData.role),
    userData.profile_img,
    validator.escape(userData.authentication_key)
  );

  if (isNaN(userID) || userID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID",
    });
  }

  // Use the update model function to update the user in the database
  Users.update(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Successfully updated the user",
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to update the user",
      });
    });
});

userController.delete("/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID",
    });
  }

  Users.deleteByID(userID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Successfully deleted the user",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete the user",
      });
    });
});

export default userController;
