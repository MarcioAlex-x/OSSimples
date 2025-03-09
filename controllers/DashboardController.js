const Ordem = require('../models/Ordem')
const Cliente = require('../models/Cliente')
const Servico = require('../models/Servico')
const User = require('../models/User')
const sequelize = require('../db/conn')

const { Op } = require('sequelize')
const moment = require('moment')

module.exports = class DasboardController{
    // painel geral
    static async showDashboard(req, res){

        const inicialDate = req.query.inicioDatePainel
        const finalDate = req.query.finalDatePainel

        const whereCondition = {}

        if(inicialDate && finalDate){
            whereCondition.createdAt = {
                [Op.between]:[
                    moment(inicialDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    moment(finalDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
                ]
            }
        }else if(inicialDate){
            whereCondition.createdAt = {
                [Op.gte]: moment(inicialDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
        }else if(finalDate){
            whereCondition.createdAt = {
                [Op.lte]:moment(finalDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
        }

        console.log('Data de inicio: ' , inicialDate)

        const ordens = await Ordem.findAll({
            where : whereCondition
        })

        const clientes = await Cliente.findAll({
            where: whereCondition
        })
        const servicos = await Servico.findAll({
            where : whereCondition
        })
        const tecnicos = await User.findAll({
            where : whereCondition
        })

        console.log(ordens.createdAt)       

        // Banner quantas odens no total
        let temOrdem = false
        const qtdOrdens = ordens.length
        if(qtdOrdens >= 1){
            temOrdem = true
        }

        // Banner de ordens em aberto
        const ordensAbertas = ordens.filter(ordem => ordem.status === 'aberto').length
        let ordensAbertasMult = false
        if(ordensAbertas > 1){
            ordensAbertasMult = true
        }

        // Banner de ordens concluidas
        const ordensConcluidas = ordens.filter(ordem => ordem.status === 'concluido').length
        let ordensConcluidasMult = false
        if (ordensConcluidas > 1){
            ordensConcluidasMult = true
        }

        // Banner de ordens entregues
        const ordensEntregues = ordens.filter(ordem => ordem.status === 'entregue').length
        let ordensEntreguesMult = false
        if (ordensEntregues > 1){
            ordensEntreguesMult = true
        }

        // Alerta de ordens atrasadas
        const data = Date.now()
        const dataAtual = new Date(data)

        const ordemDataEntregaAtrazada = ordens.filter(ordem => ordem.status === 'aberto' && ordem.prazoentrega < dataAtual).length

        let alertaOrdensAtrasadas = false

        ordemDataEntregaAtrazada > 1 ? alertaOrdensAtrasadas = true : alertaOrdensAtrasadas = false

        // quantidade de clientes
        let temClientes = false
        const qtdClientes = clientes.length
        if(qtdClientes > 1){
            temClientes = true
        }

        // quantidade de usuários do sistema
        let temTecnicos = false
        const qtdTecnicos = tecnicos.length
        if(qtdTecnicos > 1){
            temTecnicos = true
        }

        // qtd administrador do sistema
        let temAdministradores = false
        const qtdAdministrador = tecnicos.filter(user => user.nivel === 'administrador').length
        if(qtdAdministrador > 1){
            temAdministradores = true
        }

        // qtd colaboradores do sistema
        let temColaboradores = false
        const qtdColaboradores = tecnicos.filter(user => user.nivel === 'colaborador').length
        if(qtdColaboradores > 1){
            temColaboradores = true
        }



        res.render('dashboard/painel',{
            user : req.session.user,
            qtdOrdens,
            temOrdem,
            ordensAbertas,
            ordensConcluidas,
            ordensEntregues,
            ordensAbertasMult,
            ordensConcluidasMult,
            ordensEntreguesMult,
            ordemDataEntregaAtrazada,
            alertaOrdensAtrasadas,
            qtdClientes,
            temClientes,
            qtdTecnicos,
            temTecnicos,
            qtdAdministrador,
            temAdministradores,
            qtdColaboradores,
            temColaboradores
        })
    }
} 