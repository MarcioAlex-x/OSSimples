module.exports = class DasboardController{
    // painel geral
    static showDashboard(req, res){
        res.render('dashboard/painel',{
            user : req.session.user
        })
    }
    
} 