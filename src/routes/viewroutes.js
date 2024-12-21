// routes/viewsRoutes.js
import express from 'express';
const router = express.Router();

// Route for homepage
router.get('/', (req, res) => {
    res.render('homepage'); // Renders homepage.ejs
});

// Route for add new student page
router.get('/addnewstudent', (req, res) => {
    res.render('addnewstudent'); // Renders addnewstudent.ejs
});

// Route for student record page
router.get('/studentrecord', (req, res) => {
    res.render('studentrecord'); // Renders studentrecord.ejs
});

// Route for update student page
router.get('/updatestudent', (req, res) => {
    res.render('updatestudent'); // Renders updatestudent.ejs
});
router.get('/receiveFullFee', (req, res) => {
    res.render('receiveFullFee'); // Renders receivefee.ejs 
});
router.get('/feeVoucher', (req, res) => {
    res.render('feeVoucher'); // Renders feeVoucher.ejs 
});
router.get('/additionalExpances', (req, res) => {
    res.render('additionalExpances'); // Renders feeVoucher.ejs 
});
router.get('/studentFeeRecordsById', (req, res) => {
    res.render('studentFeeRecordsById'); // Renders feeVoucher.ejs 
});
router.get('/feeByAmount', (req, res) => {
    res.render('feeByAmount'); // Renders feeVoucher.ejs 
});
router.get('/feeByMonth', (req, res) => {
    res.render('feeByMonth'); // Renders feeVoucher.ejs 
});
export default router;