const knex = require("knex")(require("../knexfile"));


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


exports.index = (_req, res) => {
    knex("users")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving users: ${err}`)
        );
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
