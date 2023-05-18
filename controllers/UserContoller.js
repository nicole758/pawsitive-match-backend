const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
    knex("users")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving users: ${err}`)
        );
};
exports.getName = (req, res) => {
    const userId = req.params.id;
    knex("users")
        .where("id", userId)
        .first()
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).send(`User with ID ${userId} not found`);
            }
        })
        .catch((err) => res.status(400).send(`Error retrieving user info: ${err}`));
};


exports.login = (req, res) => {
    const { username, password } = req.body;
    knex("users")
        .where({ username, password })
        .first()
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            res.status(400).send(`Error authenticating user: ${err}`);
        });
};

exports.create = (req, res) => {
    console.log(req.body);
    knex("users")
        .insert({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        })
        .then(([id]) => {
            const newUserURL = `/users/${id}`;
            res.status(201).location(newUserURL).send(newUserURL);
        })
        .catch((err) => {
            res.status(400).send(`Error adding user: ${err}`);
        });
};



exports.addFavoriteDog = (req, res) => {
    const { userId, dogId } = req.body;
    knex('user_favorite_dogs')
        .insert({ user_id: userId, dog_id: dogId })
        .then(() => {
            res.status(201).send('Favorite dog added successfully');
        })
        .catch((err) => {
            res.status(400).send(`Error adding favorite dog: ${err}`);
        });
};

exports.removeFavoriteDog = (req, res) => {
    const { userId, dogId } = req.body;
    knex('user_favorite_dogs')
        .where({ user_id: userId, dog_id: dogId })
        .del()
        .then(() => {
            res.status(200).send('Favorite dog was deleted');
        })
        .catch((err) => {
            res.status(400).send(`Error: ${err}`);
        });
};



exports.getFavoriteDogs = (req, res) => {
    const { userId } = req.params;

    knex('user_favorite_dogs')
        .select('dog_id')
        .where({ user_id: userId })
        .then((favoriteDogs) => {
            const dogIds = favoriteDogs.map((dog) => dog.dog_id);

            knex('favoriteDogs')
                .whereIn('id', dogIds)
                .then((dogs) => {
                    res.status(200).json(dogs);
                })
                .catch((err) => {
                    res.status(400).send(`Error retrieving favorite dogs' information: ${err}`);
                });
        })
        .catch((err) => {
            res.status(400).send(`Error retrieving favorite dogs: ${err}`);
        });
};

