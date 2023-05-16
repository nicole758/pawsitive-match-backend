const knex = require("knex")(require("../knexfile"));


exports.index = (_req, res) => {
    knex("favoriteDogs")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) =>
        res.status(400).send(`Error retrieving dogs: ${err}`)
      );
  };

exports.create = (req, res) => {
    console.log(req.body);
    knex("favoriteDogs")
    .insert({
        id: req.body.id,
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        description: req.body.description,
        tags: req.body.tags,
        photo: req.body.photo
      })
      .then(() => {
         const newDogURL = `/favorite-dogs/${req.body.id}`;
        res.status(201).location(newDogURL).send(newDogURL);
      })
      .catch((err) => {
        res.status(400).send(`Error adding dog: ${err}`);
      });
  };

  exports.delete = (req, res) => {
    const dogId = req.params.id; 
  
    knex("favoriteDogs")
      .where({ id: dogId })
      .del()
      .then(() => {
        res.status(200).send("Dog deleted successfully");
      })
      .catch((err) => {
        res.status(400).send(`Error deleting dog: ${err}`);
      });
  };
  
  
  
  