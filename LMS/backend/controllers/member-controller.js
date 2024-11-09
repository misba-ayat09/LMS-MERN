const HttpError = require('../models/http-error');
const Member = require('../models/member');
const Role = require('../models/role');  // Import Role model for validation
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Constants for HTTP status codes
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

// Sign up a new member
const signup = async (req, res, next) => {
    const { member_name, email, password, phone_number, address } = req.body;

    // Check if email already exists
    let existingMember;
    try {
        existingMember = await Member.findOne({ email });
    } catch (err) {
        console.error(err);
        return next(new HttpError('Signing up failed! Please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    if (existingMember) {
        return next(new HttpError('Member already exists! Please try again later', HTTP_STATUS_UNPROCESSABLE_ENTITY));
    }

    // Check if the member's role is "member" (validate role)
    let role;
    try {
        role = await Role.findOne({ role: 'member' });
    } catch (err) {
        console.error(err);
        return next(new HttpError('Role validation failed!', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    if (!role) {
        return next(new HttpError('Role "member" not found', HTTP_STATUS_UNPROCESSABLE_ENTITY));
    }

    // Hash password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.error(err);
        return next(new HttpError('Could not create member. Please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    // Create new member
    const createMember = new Member({
        member_name,
        email,
        password: hashedPassword,
        phone_number,
        address,
        role: role._id, // Assign the "member" role
        loggedIn: false // Initially set loggedIn to false
    });

    // Save new member
    try {
        await createMember.save();
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return next(new HttpError('Invalid input data', HTTP_STATUS_UNPROCESSABLE_ENTITY));
        }
        return next(new HttpError('Signup failed!', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    res.status(HTTP_STATUS_CREATED).json({ member: createMember.toObject({ getters: true }) });
};

// Member login
const login = async (req, res, next) => {
    const { email, password } = req.body;

    // Find member by email
    let existingMember;
    try {
        existingMember = await Member.findOne({ email }).populate('role'); // Populate the role field
    } catch (err) {
        console.error(err);
        return next(new HttpError('Login failed! Please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    if (!existingMember) {
        return next(new HttpError('Invalid credentials', HTTP_STATUS_UNAUTHORIZED));
    }

    // Check if the role is "member"
    if (existingMember.role.role !== 'member') {
        return next(new HttpError('Unauthorized: Not a valid member', HTTP_STATUS_UNAUTHORIZED));
    }

    // Compare password
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingMember.password);
    } catch (err) {
        console.error(err);
        return next(new HttpError('Could not log in, please check your credentials', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not log in', HTTP_STATUS_UNAUTHORIZED));
    }

    // Update login status in MongoDB
    try {
        existingMember.loggedIn = true;
        await existingMember.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Login failed, please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    // Return member information including memberId
    res.status(HTTP_STATUS_OK).json({
        memberId: existingMember.id, // Add memberId to the response
        member: existingMember.toObject({ getters: true })
    });
};

// Member logout
const logout = async (req, res, next) => {
    const { memberId } = req.body;

    // Find member by ID and set loggedIn to false
    let member;
    try {
        member = await Member.findById(memberId);
    } catch (err) {
        console.error(err);
        return next(new HttpError('Logout failed! Please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    if (!member || !member.loggedIn) {
        return next(new HttpError('Member is not logged in', HTTP_STATUS_UNAUTHORIZED));
    }

    try {
        member.loggedIn = false;
        await member.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('Logout failed! Please try again later', HTTP_STATUS_INTERNAL_SERVER_ERROR));
    }

    res.status(HTTP_STATUS_OK).json({ message: 'Logged out successfully' });
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
