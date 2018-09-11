
const Sequelize = require('sequelize');
const Country = require('../models/Country');
const sequelize = require('../models/connection');
const Op = Sequelize.Op;
const appDebugger = require('debug')('app:appDebugger');
const redirect2ErrorPage = require('../helpers/redirect2ErrorPage');
const UserReport = require('../models/UserReport');
const redirect2Url = require('../helpers/redirect2Url');

module.exports = {

    index:async function(req,res){

        try {

            let tables = await sequelize.query('show tables');
            
            res.render('reports',{
                title:'Countries Dynamic Report',
                tables:tables
            });
            
        } catch (error) {

            appDebugger(error);
            redirect2ErrorPage(res,'500');
            
            
        }
        

    },

    getColumns:async function(req,res){
        let tableName =  req.query.tableName;
        try {

            //show columns from `cities` where `Key` != "PRI" and `Field` != "state_id" 
            
            let columns = await sequelize.query(`SHOW COLUMNS FROM ${tableName} where \`Key\` != "PRI"`);
            console.log(columns[0][1].Field);
            res.render('ajax/get_columns', {
                columns:columns[0]
            });
            

        } catch (error) {

            appDebugger(error);
            res.status(400).send('Columns not found');
            
        }
    },

    countries: async function(req,res){

        
        let sort_name   = req.query.sort_name;
        let name        = req.query.name;
        let phone_code  = req.query.phone_code;
        let name_like   = req.query.name_like;
        let cname_filter_type   = req.query.cname_filter_type;

        let attrArr = [];
        if(sort_name) attrArr.push('sortname');
        if(name) attrArr.push('name');
        if(phone_code) attrArr.push('phonecode');

        let whereObj = {
            where:{
                //
            }
        };

        if(name_like && cname_filter_type === 'like') {
            
            whereObj.where.name = {
                [Op.like]:'%'+name_like+'%'
            };

        } else if(name_like && cname_filter_type === 'equal') {
            
            whereObj.where.name = name_like;

        } else {
            
            req.query.name_like = '';

        } 

        try {
            
            try {
                
                let countries = await Country.findAll(whereObj,{attributes: attrArr});

                res.render('countries_report',{
                    title:'Countries Dynamic Report',
                    countries:countries,
                    queryString:req.query
                });

            } catch (error) {
                
                console.log('Error:', error);
                res.status(500).send('Something went wrong!!!');

            }
            
            

        } catch (error) {

            console.log('Error:', error);
            res.status(500).send('Something went wrong!!!');

        }
        

    },

    myReports: async function(req,res){

        try {

            const reports = await UserReport.findAll();
            res.render('my_reports', {
                title:"my reports",
                reports:reports
            });
            
        } catch (e) {

            appDebugger(e);
            redirect2Url(req,res,'/','Something went wrong.');
            
        }

        
    },

    saveReport: function(req,res){
        
        

        const dbTable = req.body.dbTable;
        const name = req.body.name;
        const selectedRuleType = req.body.selectedRuleType;
        const ruleVal = req.body.ruleVal;
        const reportTitle = req.body.reportTitle;
        const user = req.session.userSession;
        let indexArr = [];

        
        ruleVal.forEach(element => {
            console.log(element);
            if(element){
                indexArr.push(element);
            }
        });

        console.log(indexArr);

        selectedRuleType.forEach(element => {
            console.log(element.split('###'));
            //element.split('###');
        });

        //save only rep name 
        return res.send(req.body);

        UserReport.sync().then(() => {
            UserReport.create({
                reportTitle: reportTitle,
                tableName: dbTable,
                user_id: user.id
            }).then(function(report){
                console.log(report);
                redirect2Url(req,res,'my-reports','Report Saved.','alert-success');
            }).catch(function(e){
                appDebugger(e);
                redirect2Url(req,res,'/','Something went wrong.');
            });
        }).catch(e => {
            appDebugger(e);
            redirect2Url(req,res,'/','Something went wrong.');
        });

        
        


    }

}