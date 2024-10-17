// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByNameAndJob = (name,job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};


const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  //console.log(user);
  // generates a random id, converts to a string, and takes off the "0." on 
  // each id, for aesthetic purposes. This is a naive approach to generating 
  // ids, and technically can result in collisions (though very unlikely)
  // it'll do
  user["id"] = Math.random().toString().slice(2); 
  users["users_list"].push(user);
  return user;
};

const removeUser =
  (user) => users["users_list"].splice(users["users_list"].indexOf(user), 1);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name !== undefined && job !== undefined) {
    let result = findUserByNameAndJob(name,job);
    result = { users_list: result };
    res.send(result);
  } else if(name !== undefined){
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  // adds user to users["user_list"], and returns the newly added 
  // user with a uniquely generated id
  let new_user = addUser(userToAdd);
  // indicated successful content creation and return new user
  res.status(201).send(new_user);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  removeUser(findUserById(id));
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
