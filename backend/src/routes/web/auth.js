/**
 * Created by StarkX on 10-Mar-18.
 */
const express = require('express');
const router = express.Router();


router.get('/login', (req, res) => res.render('login.html', { req : req }));
router.get('/signup', (req, res) => res.render('signup.html', { req : req }));


module.exports = router;