var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db')
var secretString = Math.floor((Math.random() * 10000) + 1);


router.get('/', (req, res) => {
    if (req.session.user && req.session) {
        connection.query("SELECT * FROM users WHERE username != ?", [req.session.user], (err, users) => {
            if (err) {
                console.log(err);
                console.log("Couldn't fetch users");
            }
            else {
            //    console.log(users);
                var user_info = {
                    'username' : req.session.user,
                    'Email' : req.session.Email,
                    'Firstname' : req.session.Firstname,
                    'Lastname' : req.session.Lastname,
                    'profile_pic' : req.session.profile_pic,
                    'complete' : req.session.complete
                }
                var complete = 0;
                if (req.session.complete) {
                    complete = 1;
                }

                res.render('search_match', {results: users, user : user_info, complete : complete});
            }
        })
    }
    else {
        res.redirect('/login')
    }
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    var inputValue = req.body.likeType;

    if (inputValue == "Like")
    {
        connection.query('INSERT INTO `likes` (`like_from`, `like_to`) VALUES (?, ?)', [req.session.user, req.body.username], (err, users) => {
            if (err) {
                console.log(err);
                console.log("Couldn't insert like");
            }
            else{
                console.log("Like Inserted");
            }
        })
    }
    else if (inputValue == "Unlike")
    {
        connection.query('DELETE FROM `likes` WHERE `like_from` = "' + req.session.user + '"', (err, users) => {
            if (err) {
                console.log(err);
                console.log("Couldn't delete like");
            }
            else{   
                console.log("Like Deleted");
            }
        })
    }
    res.redirect('/search_match');
})

module.exports = router




/*
<head>
        <title>JavaScript - Disable Button after Click using JavaScript Function.</title>
        <script type="text/javascript">
            function disableButton(btn){
                document.getElementById(btn.id).disabled = true;
                alert("Button has been disabled.");
            }
        </script>
    </head>

    <body style="text-align: center;">
        <h1>JavaScript - Disable Button after Click using JavaScript Function.</h1>
        <p><input type="button" id="btn1" value="Click to disable button." onclick="disableButton(this)"</p>

    </body>
    */