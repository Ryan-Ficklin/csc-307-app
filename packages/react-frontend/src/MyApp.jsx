// src/MyApp.jsx
import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) { 
    let removed_id = null;
    const updated = characters.filter((character, i) => {
      if (i === index) {
        removed_id = character["id"];
      }
      return i !== index;
    });
    const promise = fetch(`http://localhost:8000/users/${removed_id}`, {
      method: "DELETE"
    });
    setCharacters(updated);
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status != 201)
          throw new Error("No content created");
        return res.json();
      })
      .then((updated_person) => setCharacters([...characters, updated_person]))
      .catch((error) => {
        console.log(error);
      });
  } 

  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit = {updateList}/>
    </div>
  );
}

export default MyApp;
