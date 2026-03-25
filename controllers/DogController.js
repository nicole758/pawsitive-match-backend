const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);


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
  const b = req.body || {};
  const row = {
    id: b.id,
    name: b.name,
    gender: b.gender,
    age: b.age,
    description: b.description,
    tags: b.tags,
    photo: b.photo,
  };
  if (b.shelter_name !== undefined) row.shelter_name = b.shelter_name;
  if (b.area_label !== undefined) row.area_label = b.area_label;
  if (b.distance_label !== undefined) row.distance_label = b.distance_label;

  knex("favoriteDogs")
    .insert(row)
    .then(() => {
      const newDogURL = `/favorite-dogs/${req.body.id}`;
      res.status(201).location(newDogURL).json({ id: req.body.id });
    })
    .catch((err) => {
      res.status(400).send(`Error adding dog: ${err}`);
    });
};

/** Legacy: hard-delete a dog and all user_favorite_dogs rows for that dog. */
exports.delete = async (req, res) => {
  const dogId = req.params.id;
  try {
    await knex.transaction(async (trx) => {
      await trx("user_favorite_dogs").where({ dog_id: dogId }).del();
      await trx("favoriteDogs").where({ id: dogId }).del();
    });
    res.status(200).send("Dog deleted successfully");
  } catch (err) {
    res.status(400).send(`Error deleting dog: ${err}`);
  }
};



