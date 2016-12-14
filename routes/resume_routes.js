var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                schools = [result.length];
                skills = [result.length];
                companies = [result.length];

                for(var i = 0; i < result.length; i++ ){
                    schools[i] = result[i].school_name;
                }

                for(var i = 0; i < result.length; i++ ){
                    skills[i] = result[i].skill_name;
                }

                for(var i = 0; i < result.length; i++ ){
                    companies[i] = result[i].company_name;
                }

                var unique_schools = schools.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var unique_skills = skills.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });

                var unique_companys = companies.filter(function (elem, index, self) {
                    return index == self.indexOf(elem);
                });

                res.render('resume/resumeViewById', {'result': result, "schools": unique_schools, 'skills': unique_skills, 'companies': unique_companys});
            }
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function (err, result0) {
        if(err){
            res.send(err);
        }
        else{
            skill_dal.getAll(function(err,result1) {
                if (err) {
                    res.send(err);
                }
                else {
                    company_dal.getAll(function(err, result2) {
                        if(err){
                            res.send(err);
                        }
                        else {
                            school_dal.getAll(function(err, result3) {
                                if(err) {
                                    res.send(err);
                                }
                                else{
                                    res.render('resume/resumeAdd', {'account': result0, 'skill': result1, 'company': result2, 'school': result3});
                                }
                            });
                        }
                    });

                }
            });
        }
    });
});

// insert a resume record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An Account must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});


router.get('/edit', function(req, res) {
    if (req.query.resume_id == null) {
        res.send('A Resume id is required');
    }
    else {
        account_dal.getAll(function (err, result0) {
            if (err) {
                res.send(err);
            }
            else {
                skill_dal.getAll(function (err, result1) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        company_dal.getAll(function (err, result2) {
                            if (err) {
                                res.send(err);
                            }
                            else {
                                school_dal.getAll(function (err, result3) {
                                    if (err) {
                                        res.send(err);
                                    }
                                    else {
                                        resume_dal.edit(req.query.resume_id, function (err, result4) {
                                            if (err) {
                                                res.send(err)
                                            }
                                            else {
                                                schools = [result4.length];
                                                skills = [result4.length];
                                                companies = [result4.length];

                                                for (var i = 0; i < result4.length; i++) {
                                                    schools[i] = result4[i].school_name;
                                                }

                                                for (var i = 0; i < result4.length; i++) {
                                                    skills[i] = result4[i].skill_name;
                                                }

                                                for (var i = 0; i < result4.length; i++) {
                                                    companies[i] = result4[i].company_name;
                                                }

                                                var unique_schools = schools.filter(function (elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });

                                                var unique_skills = skills.filter(function (elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });

                                                var unique_companies = companies.filter(function (elem, index, self) {
                                                    return index == self.indexOf(elem);
                                                });

                                                actualstuff = {
                                                    "schools": unique_schools,
                                                    'skills': unique_skills,
                                                    'companies': unique_companies
                                                };
                                                console.log(unique_skills);
                                                console.log(result1);

                                                res.render('resume/resumeUpdate', {
                                                    'resume': result4[0],
                                                    'account': result0,
                                                    'skill': result1,
                                                    'company': result2,
                                                    'school': result3,
                                                    'stuff': actualstuff
                                                });
                                            }
                                        });

                                    }
                                });
                            }
                        });

                    }
                });
            }
        });

    }


});


router.get('/update', function(req, res) {
    resume_dal.update(req.query, function(err, result){
        res.redirect(302, '/resume/all');
    });
});


module.exports = router;
