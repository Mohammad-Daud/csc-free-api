const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/AuthController');
const NotesController = require('../controllers/NotesController');

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

router.post('/register', AuthController.register);
router.get('/get-token', AuthController.getToken);



//Notes
router.get('/notes', NotesController.notes);
router.get('/module-export', NotesController.moduleExport);

module.exports = router;