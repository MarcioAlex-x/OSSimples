module.exports = class  authMiddlewares{
    // necessidade de sessão validada
    static verifyAuth(req, res, next){
        if(!req.session.user){
            req.flash('message','Você precisa efetuar o login para continuar.')
            return res.redirect('/auth/login')
        }
        next()
    }

    // Exclisividadde do administrador
    static verifyCredentials(req, res, next){

        console.log("Sessão atual:", req.session);

        if(!req.session.user || req.session.user.nivel !== 'administrador'){
            req.flash('message','O acesso à página solicitada é de exclusividade do administrador.')
            // console.log(req.session.user.nivel , 'Usuário não é administrador')
            return res.render('/dashboard/painel')
        }
        next()
    }

    // necessidade de login efetuado com usuário 
    static hasValidSession(req,res,next){
        if(req.session.user){
            return next()            
        }else{
            console.log('Erro aqui')
            req.flash('message','Faça o login para continuar.')
            return res.redirect('/auth/login')
        }
    }
}
