const Ordem = require("../models/Ordem");
const { Op } = require("sequelize");

module.exports = class RelatoriosController {
  static async showRelatorios(req, res) {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    // Definição de períodos
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 6);
    seteDiasAtras.setHours(0, 0, 0, 0);

    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);
    umMesAtras.setHours(0, 0, 0, 0);

    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(hoje.getMonth() - 6);
    seisMesesAtras.setHours(0, 0, 0, 0);

    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(hoje.getFullYear() - 1);
    umAnoAtras.setHours(0, 0, 0, 0);

    // Busca as ordens de serviço dentro dos períodos definidos
    const buscarOrdens = async (dataInicio) => {
      return await Ordem.findAll({
        where: {
          createdAt: {
            [Op.between]: [dataInicio.toISOString(), hoje.toISOString()],
          },
        },
      });
    };

    const ordensUltimosSeteDias = await buscarOrdens(seteDiasAtras);
    const ordensUltimoMes = await buscarOrdens(umMesAtras);
    const ordensUltimosSeisMeses = await buscarOrdens(seisMesesAtras);
    const ordensUltimoAno = await buscarOrdens(umAnoAtras);

    // Função para contar ordens por período
    const contarOrdensPorPeriodo = (ordens, periodo, unidadeTempo) => {
      const contagem = {};
      for (let i = 0; i < periodo; i++) {
        const data = new Date();
        if (unidadeTempo === "dias") {
          data.setDate(hoje.getDate() - i);
        } else if (unidadeTempo === "meses") {
          data.setMonth(hoje.getMonth() - i);
        } else if (unidadeTempo === "anos") {
          data.setFullYear(hoje.getFullYear() - i);
        }

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        const dataFormatada =
          unidadeTempo === "meses" ? `${ano}-${mes}` : `${ano}-${mes}-${dia}`;
        contagem[dataFormatada] = 0;
      }

      ordens.forEach((ordem) => {
        let dataOrdem

        if(unidadeTempo === 'meses'){
          dataOrdem = ordem.createdAt.toISOString().substring(0,7)
        }else{
          dataOrdem = ordem.createdAt.toISOString().split('T')[0]
        }

        if(contagem[dataOrdem] !== undefined){
          contagem[dataOrdem]++
        }
      });

      return {
        labels: Object.keys(contagem).reverse(),
        valores: Object.values(contagem).reverse(),
      };
    };

    // Processando contagens para os períodos desejados
    const seteDias = contarOrdensPorPeriodo(ordensUltimosSeteDias, 7, "dias");
    const umMes = contarOrdensPorPeriodo(ordensUltimoMes, 30, "dias");
    const seisMeses = contarOrdensPorPeriodo(
      ordensUltimosSeisMeses,
      6,
      "meses"
    );
    const umAno = contarOrdensPorPeriodo(ordensUltimoAno, 12, "meses");


    res.render("relatorios/relatorios", {
      qtdOrdensAbertas: ordensUltimosSeteDias.length,
      qtdOrdensConcluidas: ordensUltimoMes.length,
      qtdOrdensEntregues: ordensUltimosSeisMeses.length,
      seteDias: JSON.stringify(seteDias),
      umMes: JSON.stringify(umMes),
      seisMeses: JSON.stringify(seisMeses),
      umAno: JSON.stringify(umAno),
    });
  }
};
