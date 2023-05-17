import Userdb from '../models/model.js';

// create and save new user
export function create(req, res) {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // new user
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status
    });

    // save user in the database
    user
        .save()
        .then(data => {
            res.redirect('/add-user');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

// retrieve and return all users / retrieve and return a single user
export function find(req, res) {
    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id });
            });
    } else {
        Userdb.find()
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error occurred while retrieving user information" });
            });
    }
}

// Update a user identified by user id
export function update(req, res) {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" });
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update user with ${id}. Maybe user not found!` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating user information" });
        });
}

// Delete a user with the specified user id in the request
export function deleteRecord(req, res) {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete with id ${id}. Maybe id is wrong` });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
}

export default { create, find, update, deleteRecord };
