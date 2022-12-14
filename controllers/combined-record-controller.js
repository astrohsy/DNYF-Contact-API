const emailQueries = require('../db/email-queries');
const phoneQueries = require('../db/phone-queries');
const zipCodeQueries = require('../db/zip-code-queries');
const verifyService = require('../services/zip-code-verify-service');



const postRecord = async (req, res, next) => {
    
    if (!(req.body && req.body.uid && req.body.email && req.body.phone_number && req.body.zip_code)) {
        res.status(400).json({message: "Request body is missing or invalid request format"});
        return;
    }

    let uid = req.body.uid;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let zip_code = req.body.zip_code;

    verifyService.verifyZipCode(zip_code)
    .then((valid) => {

        if (!valid) {
            res.status(400).json({message: "Invalid zip code"});
            return;
        }

        Promise.all([
            emailQueries.postEmail(uid, email), 
            phoneQueries.postPhone(uid, phone_number), 
            zipCodeQueries.postZipCode(uid, zip_code, valid)
        ])
        .then((result) => {
            result = {uid: uid, email: email, phone_number: phone_number, zip_code: zip_code};
    
            res.status(200).json({data: result});
        })
        // Delete inserted record if any insertion fails
        .catch((error) => {
    
            Promise.all([
                emailQueries.deleteEmailByUid(uid), 
                phoneQueries.deletePhoneByUid(uid),
                zipCodeQueries.deleteZipCodeByUid(uid)
            ])
            .then((result) => {
    
                error.statusCode = 400;
                next(error);
    
            })
            .catch((err) => {
    
                error.message = "Failed to clean up database after failed record insertion";
                error.statusCode = 500;
                next(error);
    
            })
    
        })

    });
};

exports.postRecord = postRecord;