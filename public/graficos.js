document.addEventListener('DOMContentLoaded', function () {
    const criarGrafico = (idCanvas, titulo, labels, dados) => {
        const ctx = document.getElementById(idCanvas).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: titulo,
                    data: dados,
                    backgroundColor: ['#273c75','#e84118','#4cd137','#fbc531','#00a8ff','#9c88ff','#55efc4','#81ecec','#74b9ff','#a29bfe','#00b894','#00cec9','#0984e3','#6c5ce7','#ffeaa7','#fab1a0','#ff7675','#fd79a8','#fdcb6e','#e17055','#d63031','#e84393'],
                    borderColor: ['#dfe6e9'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Verificar se os dados estão carregados corretamente
    if (typeof qtdOrdensAbertas === "undefined" || typeof qtdOrdensConcluidas === "undefined" || typeof qtdOrdensEntregues === "undefined") {
        console.error("Erro: Variáveis não estão disponíveis.");
        return;
    }

    // Criar os gráficos
    // criarGrafico('qtdOrdens', 'Ordens de Serviço', ['Abertas', 'Concluídas', 'Entregues'], [qtdOrdensAbertas, qtdOrdensConcluidas, qtdOrdensEntregues]);

    criarGrafico('ordensSeteDias', 'Últimos 7 dias', seteDias.labels, seteDias.valores);
    criarGrafico('ordensUmMes', 'Último mês', umMes.labels, umMes.valores);
    criarGrafico('ordensSeisMeses', 'Últimos 6 meses', seisMeses.labels, seisMeses.valores);
    criarGrafico('ordensUmAno', 'Último ano', umAno.labels, umAno.valores);
});
