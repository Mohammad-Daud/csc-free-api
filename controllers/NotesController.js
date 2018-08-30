module.exports = {
    moduleExport: function(req, res){
        res.render('module_export', {
            title: 'module-export'
        });
    },
    notes:function(req, res){
        res.render('notes', {
            title: 'Notes'
        });
    }
}

