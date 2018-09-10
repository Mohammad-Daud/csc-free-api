const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/AuthController');
const NotesController = require('../controllers/NotesController');
const DynamicReportController = require('../controllers/DynamicReportController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home'
  });
});




router.get('/todo', function (req, res, next) {
  res.render('todo', {
    title: 'TODO'
  });
});

router.get('/users', function (req, res, next) {
  res.send('respond with a resource');
});

//Auth
router.post('/auth', AuthController.auth);
router.get('/register', AuthController.registerForm);
router.post('/register', AuthController.register);
router.get('/get-auth-user', auth, AuthController.authUser);
router.get('/login', AuthController.login);
router.post('/get-access-token', AuthController.getAccessToken);


//Notes
router.get('/notes',[auth, isAdmin], NotesController.notes);
router.get('/module-export', NotesController.moduleExport);

//DYNAMIC REPORTS -- open to all

router.get('/dynamic-report/countries', DynamicReportController.countries);

module.exports = router;