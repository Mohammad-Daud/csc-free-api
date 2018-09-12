
const Sequelize = require('sequelize');
const Country = require('../models/Country');
const sequelize = require('../models/connection');
const Op = Sequelize.Op;
const appDebugger = require('debug')('app:appDebugger');
const redirect2ErrorPage = require('../helpers/redirect2ErrorPage');
const UserReport = require('../models/UserReport');
const redirect2Url = require('../helpers/redirect2Url');
const ReportColumn = require('../models/ReportColumn');

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
        
        const selectedRuleType = req.body.selectedRuleType;
        const ruleVal = req.body.ruleVal;
        const reportTitle = req.body.reportTitle;
        const user = req.session.userSession;
        let finalArr = {};

        selectedRuleType.forEach(function(val, index){
            if(ruleVal[index]){
                finalArr[val] = ruleVal[index];
            }
        });

        UserReport.sync().then(() => {
            UserReport.create({
                reportTitle: reportTitle,
                tableName: dbTable,
                user_id: user.id
            }).then(function(report){
                

                Object.keys(finalArr).map(function(objectKey) {

                    let value = finalArr[objectKey];
        
                    
                    
                    ReportColumn.sync().then(function(){
                        
                        ReportColumn.create({
                            columnTitle: objectKey.split('###')[0],
                            selectedRuleType: objectKey.split('###')[1],
                            ruleValue: value,
                            report_id: report.id
                        }).then(function(reportCol){
                            appDebugger(reportCol);
                        }).catch(function(e){
                            appDebugger(e);
                            redirect2Url(req,res,'/','Something went wrong.');
                        });
        
                    }).catch(function(e){
        
                        appDebugger(e);
                        redirect2Url(req,res,'/','Something went wrong.');
        
                    });
                    
                    
                    
                });

                redirect2Url(req,res,'my-reports','Report Saved.','alert-success');
            }).catch(function(e){
                appDebugger(e);
                redirect2Url(req,res,'/','Something went wrong.');
            });
        }).catch(e => {
            appDebugger(e);
            redirect2Url(req,res,'/','Something went wrong.');
        });

        
        


    },

    getReport: async function(req,res){

        const reportId = req.params.id;
        const user = req.session.userSession;

        const sqlMap = {
            "like":'like',
            "startwith": 'like',
            "equal": '='
        };


        try {

            const userRep = await UserReport.findOne({
                where:{
                    id:reportId,
                    user_id:user.id
                }
            });

            const userRepCols = await ReportColumn.findAll({
                where:{
                    report_id:userRep.id
                }
            });
            
            const reportTitle = userRep.reportTitle;
            const tableName = userRep.tableName;

            let cols = '';
            let wherePart = 'where 1 and ';
            
            userRepCols.forEach(function(elem){
                let s = elem.selectedRuleType;
                cols += elem.columnTitle + ',';
                wherePart += elem.columnTitle + ' ' + sqlMap[s] + ' ' + '"'+elem.ruleValue+'"' + ' and ';
            });

            cols = cols.replace(/,\s*$/, "");
            wherePart = wherePart.replace(/and\s*$/, "");
            wherePart = wherePart.replace(/ \s*$/, "");

            console.log(wherePart);

            console.log(`select ${cols} from ${tableName} ${wherePart};`);

            let queryResults = await sequelize.query(`select ${cols} from ${tableName} ${wherePart};`);

            console.log(queryResults);

            //res.send(userRepCols);

            res.render('view_report',{
                queryResults:queryResults[0],
                title:'Report',
                userRepCols:userRepCols
            })
            
        } catch (error) {

            appDebugger(error);
            redirect2Url(req,res,'/','Something went wrong.');
            
        }

        

        

    }

}