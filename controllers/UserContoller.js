const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);

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
        .then((result) => {
            const id = Array.isArray(result) ? result[0] : result;
            res.status(201).location(`/users/${id}`).json({ id });
        })
        .catch((err) => {
            res.status(400).send(`Error adding user: ${err}`);
        });
};

/** POST /users/:id/profile — body: name, email, bio, number, address, city, state, zip */
exports.updateProfile = (req, res) => {
    const userId = req.params.id;
    const { name, email, bio, number, address, city, state, zip } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (email !== undefined) patch.email = email;
    if (bio !== undefined) patch.bio = bio;
    if (number !== undefined) patch.phone = number;
    if (address !== undefined) patch.address = address;
    if (city !== undefined) patch.city = city;
    if (state !== undefined) patch.state = state;
    if (zip !== undefined) patch.zip = zip;

    if (Object.keys(patch).length === 0) {
        return res.status(400).send("No profile fields to update");
    }

    knex("users")
        .where("id", userId)
        .update(patch)
        .then((count) => {
            if (count === 0) {
                return res.status(404).send(`User with ID ${userId} not found`);
            }
            res.status(200).json({ ok: true });
        })
        .catch((err) => res.status(400).send(`Error updating profile: ${err}`));
};



exports.addFavoriteDog = (req, res) => {
    const routeUserId = req.params.id;
    const { userId, dogId } = req.body;
    if (userId == null || dogId == null) {
        return res.status(400).send("userId and dogId are required");
    }
    if (String(routeUserId) !== String(userId)) {
        return res.status(403).send("userId must match URL");
    }
    knex("user_favorite_dogs")
        .insert({ user_id: userId, dog_id: dogId })
        .then(() => {
            res.status(200).send("OK");
        })
        .catch((err) => {
            res.status(400).send(`Error adding favorite dog: ${err}`);
        });
};

/**
 * DELETE /users/:userId/favorite-dogs/:dogId
 * Removes this user's favorite row; deletes the dog from favoriteDogs only if no other user references it.
 */
exports.removeUserFavoriteDog = async (req, res) => {
    const { userId, dogId } = req.params;
    try {
        const outcome = await knex.transaction(async (trx) => {
            const removed = await trx('user_favorite_dogs')
                .where({ user_id: userId, dog_id: dogId })
                .del();
            if (removed === 0) {
                return { notFound: true };
            }
            const stillReferenced = await trx('user_favorite_dogs')
                .where({ dog_id: dogId })
                .first();
            if (!stillReferenced) {
                await trx('favoriteDogs').where({ id: dogId }).del();
                return { removedFavorite: true, dogDeleted: true };
            }
            return { removedFavorite: true, dogDeleted: false };
        });
        if (outcome.notFound) {
            return res.status(404).send('Favorite not found');
        }
        res.status(200).json(outcome);
    } catch (err) {
        res.status(400).send(`Error removing favorite: ${err}`);
    }
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

/**
 * GET /users/:userId/applications
 * Returns [{ dogId, status }, ...]
 */
exports.listApplications = (req, res) => {
    const { userId } = req.params;
    knex("user_dog_applications")
        .select("dog_id", "status")
        .where({ user_id: userId })
        .then((rows) => {
            const applications = rows.map((r) => ({
                dogId: r.dog_id,
                status: r.status,
            }));
            res.status(200).json(applications);
        })
        .catch((err) => {
            res.status(400).send(`Error retrieving applications: ${err}`);
        });
};

/**
 * POST /users/:userId/applications
 * Body: { dogId, status } — upsert on unique (user_id, dog_id)
 */
exports.upsertApplication = async (req, res) => {
    const { userId } = req.params;
    const { dogId, status } = req.body || {};

    if (dogId == null || dogId === "") {
        return res.status(400).send("dogId is required");
    }
    if (status == null || status === "") {
        return res.status(400).send("status is required");
    }

    try {
        const exists = await knex("users").where("id", userId).first();
        if (!exists) {
            return res.status(404).send(`User with ID ${userId} not found`);
        }

        await knex.raw(
            `INSERT INTO user_dog_applications (user_id, dog_id, status) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
            [userId, dogId, status]
        );
        res.status(200).json({ dogId, status });
    } catch (err) {
        res.status(400).send(`Error saving application: ${err}`);
    }
};

