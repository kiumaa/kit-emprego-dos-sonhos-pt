# KEDS v3 — Funil de diagnóstico e venda, entrega pela OKANDA

Pacote complementar de refatoração. NÃO é uma cópia do repositório nem uma aplicação completa.
Data da revisão: 12 de setembro de 2026. Base inspecionada: `b75d31a223ca6b624b56723a4c1b90dc52efe76e` em `main`.
Nenhuma alteração foi enviada para o GitHub por esta revisão.

## Decisão do responsável
Analisador de CV / quiz → resultado resumido e útil → âncora para VSL + oferta → checkout externo OKANDA PAY.
A OKANDA fica responsável pela compra, bumps e entrega dos produtos. Sem área de membros, editor de CV, autenticação do comprador ou gestor de candidaturas no site.
Satoshi substitui Manrope na linguagem tipográfica, preservando o azul, branco, grafite e o carácter humano da marca.

## Começar
1. Ler `docs/AUDITORIA.md` e `PROMPT_ANTIGRAVITY.md`.
2. Inspecionar o estado atual do repositório: pode já ter evoluído desde o commit revisto.
3. Aplicar a alteração numa branch, sem apagar alterações locais não guardadas.
4. Usar `design/DIRECAO_VISUAL_PRODUTOS.md`, `design/tokens-v3.patch.json` e as referências.
5. Integrar `implementation/VslPlayer.tsx`, o controlador e o CSS. Ler `implementation/INTEGRACAO.md`.
6. Executar os critérios de `qa/ACEITACAO.md`.

## O que este pacote contém
Auditoria baseada em código; prompt completo; direção editorial das capas e interiores; configuração de exemplo; componente React de VSL; controlador de media sem dependências, versão JavaScript compilada e declarações; CSS; critérios de aceitação; três flyers já apresentados como referência.

## O que não contém
VSL final, fontes, produtos PDF/DOCX finais redesenhados, chaves de API, link definitivo do checkout, aplicação já refatorada ou prova de vendas reais.
Os flyers são referências de linguagem e composição. Não garantem que os mockups neles representados correspondam aos ficheiros finais vendidos.

A revisão do repositório é estática. Não foi executado o build original nem acedido o localhost da máquina do responsável. A QA do controlador de vídeo está documentada separadamente; não equivale à validação completa da aplicação.
