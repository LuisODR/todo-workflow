// Checklist da aba "Fluxo de Venda" (o checklist original, 1 cliente por vez)
export const FLUXO_VENDA_STEPS = [
  "Criar a pasta do cliente + Anotar nome dele aqui",
  "Separar peças fisicamente as que foram vendidas",
  "Retirar as fotos das peças da pasta de fotos e passar para a pasta do cliente",
  "Anotar no Notas o endereço do cliente + salvar no contato cidade e Estado",
  "Anotar qual é o custo da peça na foto dela (dentro do envelope)",
  "Retirar as peças do ESTOQUE",
  "Retirar as peças do Site + Mercado Livre",
  "Criar o pedido cliente em documento de Excel/PDF + Colocar na pasta dele",
  "Trocar a etiqueta (whatsapp) - Parar aqui em Pedidos do wpp",
  "Colocar para imprimir o pedido do Cliente",
  "Ver se o cliente adquiriu seguro (Mercado Livre não)",
  "Ver se alguma moeda precisa do Termo de Autenticidade, R$1.000,00",
  "Inserir valor recebido no Fluxo de Vendas",
  "Convidar o cliente para o Grupo Exclusivo - Msg Automatica (conviteZN)",
];

export const FLUXO_VENDA_ORIGENS = ["Site", "Xiaomi", "Samsung", "Numeração"];

// Checklist "Geral" (Tray / loja própria) da aba "Finalização de Vendas"
export const FINALIZACAO_GERAL_STEPS = [
  "Criar a pasta do cliente e anotar o nome dele aqui no github",
  "Anotar no NOTAS o endereço do cliente + cidade e estado",
  "Separar as peças fisicamente as que foram vendidas",
  "Retirar as peças da pasta de fotos e passar para a pasta do cliente",
  "Retirar as peças do ESTOQUE - powerpoint",
  "Retirar as peças do: Tray",
  "Retirar as peças do: Mercado Livre",
  "Criar o pedido cliente em documento de Excel/PDF + Colocar na pasta dele",
  "Colocar etiqueta (WPP): Parar o processo nessa etapa e aguardar caso o pedido seja uma reserva. Se não for reserva, organizar o pedido para ser enviado para a embalagem",
  "Imprimir: Apenas pedidos Zanotto - Não Imprimir: Pedidos de Vendedores",
  "OFERECER o seguro - Exceção: Clientes vindos do Mercado Livre ou perfis de Vendedores não necessitam de seguro (pular esta checagem)",
  "Ver se alguma moeda precisa do Termo de Autenticidade, R$ 1.000,00",
  "Inserir valor recebido no Fluxo de Vendas",
];

// Checklist "Finalização Mercado Livre" da aba "Finalização de Vendas"
export const FINALIZACAO_ML_STEPS = [
  "Criar uma pasta do cliente e anotar o nome dele aqui e no Github",
  "Criar o pedido cliente em documento de Excel/PDF + Colocar na pasta dele",
  "Separar as peças que foram vendidas",
  "Retirar as peças da pasta de fotos e passar para a pasta do cliente",
  "Retirar as peças do ESTOQUE - powerpoint",
  "Retirar as peças do site",
  "Retirar as peças do Mercado Livre",
  "Enviar o pedido para a embalagem",
  "Imprimir: o pedido",
  "Ver se alguma moeda precisa do Termo de Autenticidade, R$ 1.000,00",
  "Inserir valor recebido no Fluxo de Caixa",
];
