const { raw } = require('express')
const InfoAss = require('../models/InfoAss')
const fs = require('fs')
const path = require('path')

module.exports = class InfosAssController{
    static async create(req,res){
        const infosCadastradas = await InfoAss.findAll()
        if( infosCadastradas.length === 0){
            res.render('infos/create')
        }else{
            res.redirect('/infos/showInfos')
        }
    }

    static async showInfos(req,res){
        const infosCadastradas = await InfoAss.findAll({raw: true})
        
        res.render('infos/showInfos', {infosCadastradas})
    }

    static async addInfos(req,res){
        const {assistencia, endereco,cidade, estado, complemento, email, whatsapp, responsavel } = req.body
        try{
            const infos = {
                assistencia,
                endereco,
                cidade,
                estado,
                complemento,
                email,
                whatsapp,
                responsavel,
            }
            await InfoAss.create(infos)

            return res.redirect('/infos/create')
        }catch(err){
            console.log(err)
        }
    }

    // Editar as informações
    static async updateInfos(req,res){
        const id = req.params.id
        
        const infos = await InfoAss.findOne({
            where:{ id }
        })
        try{
            
            console.log(infos)
            return res.render('infos/edit', { infos : infos.dataValues })
        }catch(err){
            req.flash('message','Não foi possível recuperar os dados da sua assistência, por favo tente mais tarde.')
            return res.redirect('/dashboard/painel')
        }
    }

    //Salvar dados editados
    static async updatePost(req, res){
        const {
            id,
            assistencia,
            endereco,
            cidade,
            estado,
            complemento,
            email,
            whatsapp,
            responsavel
        } = req.body

        try{
            const infos = {
                assistencia,
                endereco,
                cidade,
                estado,
                complemento,
                email,
                whatsapp,
                responsavel
            }
            await InfoAss.update(infos, { where: { id }})
            req.flash('message','Informações atualizadas com sucesso.')
            return res.redirect('/infos/showInfos')
        }catch(err){
            req.flash('message','Não foi possível atualizar as informações. Favor tente mais tarde.')
            return res.render('infos/edit')
        }
    }
}
