const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


router.get('/register', (req, res) => {
    res.render("register");
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 10 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async(req, res) => {
        const errors = validationResult(req);
        // console.log('username:', req.body.username);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data',
                // username: req.body.username,
                // email: req.body.email,
                // password: req.body.password
            });
        }
        // console.log('Request Body:', req.body);
        const { email, password, username } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: hashPassword
        });

        return res.json(newUser);
    }
)


router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async(req, res) => {
        const errors = validationResult(req);
        // console.log('username:', req.body.username);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data',
            })
        }
        const { username, password } = req.body;


        const user = await userModel.findOne({
            username: username

        })
        if (!user) {
            return res.status(400).json({
                message: 'username or password is not correct'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: 'password is not correct'
            })
        }

        const token = jwt.sign({
                userId: user._id,
                email: user.email,
                password: user.password
            },
            process.env.JWT_SECRET,
        )

        res.cookie('token', token)
        res.send('loged in')
    })

module.exports = router;