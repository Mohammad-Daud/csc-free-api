
const Sequelize = require('sequelize');
const Country = require('../models/Country');
const Op = Sequelize.Op;
module.exports = {

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
        

    }

}