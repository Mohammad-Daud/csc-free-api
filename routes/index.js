const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/AuthController');
const NotesController = require('../controllers/NotesController');
const DynamicReportController = require('../controllers/DynamicReportController');
const CscApiController = require('../controllers/api/CscApiController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const guest = require('../middleware/guest');
const sessionBasedAuth = require('../middleware/sessionBasedAuth');

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
router.get('/register',guest, AuthController.registerForm);
router.post('/register',guest, AuthController.register);
router.get('/get-auth-user', auth, AuthController.authUser);
router.get('/login', guest, AuthController.login);
router.post('/get-access-token', AuthController.getAccessToken);
router.get('/logout', AuthController.logout);


//Notes
router.get('/notes',[auth, isAdmin], NotesController.notes);
router.get('/module-export', NotesController.moduleExport);

//CSC API
router.get('/countries-list',auth, CscApiController.countriesList);
router.get('/state-list-with-city', auth, CscApiController.stateListWithCity);
router.get('/countries-list-with-state', auth, CscApiController.countriesListWithState);
router.get('/state-list', auth, CscApiController.stateList);

//DYNAMIC REPORTS
router.get('/dynamic-report', sessionBasedAuth, DynamicReportController.index);
router.get('/dynamic-report/get-columns', sessionBasedAuth, DynamicReportController.getColumns);
router.get('/dynamic-report/countries', sessionBasedAuth, DynamicReportController.countries);
router.get('/my-reports', sessionBasedAuth, DynamicReportController.myReports);
router.post('/save-report', sessionBasedAuth, DynamicReportController.saveReport);
router.get('/get-report/:id',sessionBasedAuth,DynamicReportController.getReport);




//ERRORS
router.get('/500', function(req,res){
  res.render('500',{
    title:'500'
  });
});


module.exports = router;