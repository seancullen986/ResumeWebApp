var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view resume_view as
 select s.*, a.street, a.zip_code from resume s
 join account a on a.account_id = s.account_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT r.* , first_name, skill_name, company_name, school_name FROM resume r ' +
        'LEFT JOIN account a ON a.account_id = r.account_id ' +
        'LEFT JOIN resume_skill rs ON r.resume_id = rs.resume_id ' +
        'LEFT JOIN skill s ON s.skill_id = rs.skill_id ' +
        'LEFT JOIN resume_company rc ON rc.resume_id = r.resume_id ' +
        'LEFT JOIN company c ON c.company_id = rc.company_id ' +
        'LEFT JOIN resume_school rsc ON rsc.resume_id = r.resume_id ' +
        'LEFT JOIN school sch ON sch.school_id = rsc.school_id ' +
        'WHERE r.resume_id = ?;';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var querySkill = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';
        var queryCompany = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
        var querySchool = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var resumeSkillData = [];
        for(var i=0; i < params.skill_id.length; i++) {
            resumeSkillData.push([resume_id, params.skill_id[i]]);
        }

        var resumeCompanyData = [];
        for(var i=0; i < params.company_id.length; i++) {
            resumeCompanyData.push([resume_id, params.company_id[i]]);
        }

        var resumeSchoolData = [];

        for(var i=0; i < params.school_id.length; i++) {
            resumeSchoolData.push([resume_id, params.school_id[i]]);

        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(querySkill, [resumeSkillData], function(err, result){
            connection.query(queryCompany, [resumeCompanyData], function(err, result){
                connection.query(querySchool, [resumeSchoolData], function(err, result){
                    callback(err, result);
                });
            });
        });
    });

};


exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var query1 = 'SELECT account_id FROM resume Where resume_id = ?';
    var queryData = resume_id;

    connection.query(query1, queryData, function(err, result1) {
        var queryData1 = [resume_id, result1[0].account_id];
        connection.query(query, queryData1, function (err, result) {
            callback(err, result[0]);
        });

    });
};


exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};



                        // resume_school functions



var resumeSchoolInsert = function(resume_id, schoolIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    for(var i=0; i < schoolIdArray.length; i++) {
        resumeSchoolData.push([resume_id, schoolIdArray[i]]);
    }
    connection.query(query, [resumeSchoolData], function(err, result){
        callback(err, result);
    });
};


//export the same function so it can be used by external callers
module.exports.resumeSchoolInsert = resumeSchoolInsert;


//declare the function so it can be used locally
var resumeSchoolDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


//export the same function so it can be used by external callers
module.exports.resumeSchoolDeleteAll = resumeSchoolDeleteAll;



                        // resume_company functions



var resumeCompanyInsert = function(resume_id, companiesIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeCompanyData = [];

    for(var i=0; i < companiesIdArray.length; i++) {
        resumeCompanyData.push([resume_id, companiesIdArray[i]]);
    }

    connection.query(query, [resumeCompanyData], function(err, result){
        callback(err, result);
    });
};


//export the same function so it can be used by external callers
module.exports.resumeCompanyInsert = resumeCompanyInsert;


var resumeCompanyDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


//export the same function so it can be used by external callers
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;



                        // resume_skill functions



var resumeSkillInsert = function(resume_id, skillsIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];

    for(var i=0; i < skillsIdArray.length; i++) {
        resumeSkillData.push([resume_id, skillsIdArray[i]]);
    }

    connection.query(query, [resumeSkillData], function(err, result){
        callback(err, result);
    });
};


//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;


var resumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

//export the same function so it can be used by external callers
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;





exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = (?), account_id = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.account_id, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        resumeSkillDeleteAll(params.resume_id, function(err, result){
            resumeSchoolDeleteAll(params.resume_id, function(err, result){
                resumeCompanyDeleteAll(params.resume_id, function(err, result){
                    if(params.skill_id != null) {
                        //insert company_address ids
                        resumeSkillInsert(params.resume_id, params.skill_id, function(err, result){
                            if(params.school_id != null) {
                                resumeSchoolInsert(params.resume_id, params.school_id, function(err, result){
                                    if(params.company_id != null) {
                                        resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                                            callback(err, result);
                                        });}
                                    else{
                                        callback(err, result);
                                    }
                                });}
                            else{
                                if(params.company_id != null) {
                                    resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                                        callback(err, result);
                                    });}
                                else{
                                    callback(err, result);
                                }
                            }
                        });}
                    else {
                        if(params.school_id != null) {
                            resumeSchoolInsert(params.resume_id, params.school_id, function(err, result){
                                if(params.company_id != null) {
                                    resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                                        callback(err, result);
                                    });}
                                else{
                                    callback(err, result);
                                }
                            });}
                        else{
                            if(params.company_id != null) {
                                resumeCompanyInsert(params.resume_id, params.company_id, function(err, result){
                                    callback(err, result);
                                });}
                            else{
                                callback(err, result);
                            }
                        }
                    }
                });
            });
        });

    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;

 DELIMITER //
 CREATE PROCEDURE company_getinfo (_company_id int)
 BEGIN

 SELECT * FROM company WHERE company_id = _company_id;

 SELECT a.*, s.company_id FROM address a
 LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id
 ORDER BY a.street, a.zip_code;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL company_getinfo (4);

 */
