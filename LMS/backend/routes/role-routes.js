const express = require('express');
const router = express.Router();
const HttpError = require('../models/http-error'); // Import HttpError
const Role = require('../models/role'); // Import the Role model

// Route to get all roles
router.get('/roles', async (req, res, next) => {
    let roles;
    try {
        roles = await Role.find({});
    } catch (err) {
        return next(new HttpError('Fetching roles failed', 500));
    }
    res.json({ roles: roles.map(role => role.toObject({ getters: true })) });
});

router.get('/roles/:id', async (req, res, next) => {
    const roleId = req.params.id; // Extracting the role ID from the URL

    let role;
    try {
        role = await Role.findById(roleId); // Find the role by its ID
    } catch (err) {
        return next(new HttpError('Fetching role failed, please try again later', 500));
    }

    if (!role) {
        return next(new HttpError('Role not found', 404));
    }

    res.json({ role: role.toObject({ getters: true }) }); // Send the role as response
});

// Route to create a new role
router.post('/roles', async (req, res, next) => {
    console.log('Request body:', req.body);  // Add this line for debugging

    const { role } = req.body;
    console.log('Received role:', role); // Debugging line

    // Validate input
    if (!role) {
        return next(new HttpError('Role name is required', 422));
    }

    // Check if role already exists
    let existingRole;
    try {
        existingRole = await Role.findOne({ role: role });
    } catch (err) {
        console.error('Error checking existing role:', err); // Debugging line
        return next(new HttpError('Creating role failed, please try again later', 500));
    }

    if (existingRole) {
        return next(new HttpError('Role already exists', 422));
    }

    // Create new role
    const createdRole = new Role({ role });

    // Save new role
    try {
        await createdRole.save();
    } catch (err) {
        console.error('Error saving new role:', err); // Debugging line
        return next(new HttpError('Creating role failed', 500));
    }

    res.status(201).json({ role: createdRole.toObject({ getters: true }) });
});



module.exports = router;
