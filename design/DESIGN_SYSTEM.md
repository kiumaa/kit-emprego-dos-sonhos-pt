# Sistema visual único — “Clareza para o próximo passo”

## Intenção
Profissional, clean, moderno e humano. A referência Apple significa cuidado na hierarquia, espaço, tipografia, fluidez e acabamento; **não** copiar logótipos, hardware, ícones proprietários, fontes proprietárias ou frases da marca.

Este documento é uma direção concreta de implementação, não um screenshot aprovado. O pacote não inclui artes finais nem uma interface já validada. O Antigravity produz e verifica os ecrãs a partir destes critérios.

## Regras estruturais
`tokens.json` é a fonte de verdade; `tokens.css` é derivado. Evitar hexadecimais, espaçamentos e tamanhos ad hoc nos componentes. Manrope é a primeira opção; não distribuir ficheiros de fontes no repositório. Resolver a fonte com uma licença/forma de carregamento apropriada, com fallback previsível. Não usar a SF Pro como ficheiro fornecido no pacote.

Fundo branco real, não creme. Superfícies `#F5F5F7`, texto grafite, destaque azul reservado a ações e informação importante. Cor semântica acompanha sempre uma palavra/ícone; nunca codificar resultados apenas pela cor. Sem fundo azul em todas as secções, gradientes roxos, brilhos artificiais, texto dourado, pseudo-métricas ou animações contínuas.

Headings Manrope semibold, peso bold apenas em pontos-chave. Body 17px/1.55. H1 respira; nunca comprimir uma promessa longa em três linhas de texto gigante no telemóvel. No mobile, título do primeiro ecrã entre 32 e 40px, com 20px de margem lateral. Leitura longa limitada a 720px. Formulários a 560px. Conteúdo principal a 1200px.

## Marca
Usar wordmark tipográfico “Emprego dos Sonhos”, com “Portugal” discreto quando necessário. O nome comercial completo mantém-se em oferta, compra e documentos. Não inventar um logótipo complexo para ocupar o hero. Não colocar bandeiras como padrão repetitivo. Não usar a marca Apple nem simular uma parceria com LinkedIn, IEFP ou recrutadores.

## Linguagem de layout
Páginas públicas: cabeçalho simples, uma ação dominante, grandes zonas abertas, demonstração clara de recursos, alternância de texto e produto. Evitar transformar cada parágrafo num card ou repetir cinco secções com a mesma grelha. O primeiro ecrã deve mostrar problema, utilidade e início do diagnóstico.

Diagnóstico: uma tarefa de cada vez. Quiz com contador “Pergunta 3 de 8”, voltar, botão continuar e opções acessíveis. Não avançar automaticamente sem permitir correção. Analisador com área de ficheiro e alternativa de colar texto/quiz; sem dashboard decorativo.

Resultados: prioridade à interpretação e ação gratuita. A oferta começa depois do relatório, com transição editorial, VSL e amostras reais. Não inventar barras “ATS 42%” ou vermelho alarmista. Um relatório favorável continua favorável.

Área privada: sidebar discreta desktop, navegação compacta mobile, foco em continuar uma tarefa. Biblioteca com miniaturas coerentes, títulos descritivos e formatos. Gestor de candidaturas em lista/tabela desktop e cartões funcionais mobile; não usar arrastar-e-largar como único controlo.

## Componentes e estados
Uma família de botões, inputs, navegação, tabs e feedback. Altura de controlo 48px; alvos táteis generosos. Focus visível e contraste legível. Estados de erro junto do campo, resumo acessível se necessário. Loading comunica atividade real, nunca percentagens inventadas. Skeleton só quando o conteúdo está efetivamente a ser carregado.

Ícones de uma única biblioteca, traço coerente, 20–24px, sem emojis como controlos. Hover subtil; transições 160–240ms e respeito por movimento reduzido. Modais apenas quando há necessidade real; não fazer cascatas de popups para captar email.

## Coerência transversal
A mesma escala de contraste, títulos, margens e motifs aplica-se à VSL, capas dos guias, páginas de recursos, emails e anúncios. Documento A4 não é uma página web reduzida: adaptar unidades e paginação sem mudar de linguagem. CVs entregues ao comprador não levam publicidade, CTA ou marca d'água do kit no ficheiro destinado a recrutamento.

## Critério de aprovação visual
Verificar 360, 390, 768, 1280 e 1440px. Não pode haver overflow, texto cortado, contraste fraco, botões desalinhados, diferentes azuis para a mesma ação ou margens inconsistentes. Rever um ecrã público, um de diagnóstico, um privado, um recurso PDF e um criativo lado a lado. Consistência não significa tornar todos os formatos idênticos: preserva os tokens e adapta o layout ao uso.
