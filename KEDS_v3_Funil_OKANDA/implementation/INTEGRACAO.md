# Integração do leitor de vídeo

Copiar `VslPlayer.tsx`, `vsl-controller.ts` e `vsl-player.css` para a pasta de componentes do projeto. A pasta `compiled/` serve a demonstração/teste sem framework; a app TypeScript pode usar diretamente o `.ts`.

```tsx
import { VslPlayer } from '@/components/marketing/VslPlayer';

<a href="#apresentacao">Ver como preparar a minha candidatura</a>

<VslPlayer
  id="apresentacao"
  src={config.vsl.src}
  poster={config.vsl.poster ?? undefined}
  captionsSrc={config.vsl.captionsSrc ?? undefined}
  transcript={transcriptText}
/>

{/* A oferta e o checkout são independentes do tempo visto do vídeo. */}
```

A fonte é herdada do design system. Este componente NÃO carrega nem distribui Satoshi. O CSS usa tokens existentes com fallbacks. O wrapper é React client component; o controlador depende apenas das APIs do navegador.

`src` vazio produz uma nota honesta, sem vídeo fictício. Só configurar URL real do vídeo depois de o ficheiro existir. Preferir fonte de media e legendas no mesmo domínio; num CDN, validar MIME, HTTP range requests, CORS para legendas e condições de privacidade. Não instalar um player externo com tracking apenas para este comportamento.

Com fonte válida: a primeira preview inicia muda quando pelo menos metade do leitor está visível, salvo preferências de acessibilidade/economia de dados ou bloqueio do navegador. Clicar no botão reinicia a 0 e solicita reprodução com som no mesmo gesto. Preview pode ser pausada; reprodução completa tem controlos nativos. Sair do ecrã/separador pausa, nunca retoma som automaticamente.

O controlador não faz rede além do media do próprio video, não recolhe contactos e não envia eventos de analytics. Adicionar métricas opcionais pela camada da aplicação, com consentimento aplicável e sem texto do CV.

## Estado de validação
O controlador foi compilado em TypeScript estrito e tem QA isolada descrita em `qa/VALIDACAO_VSL.md`. O wrapper React deve passar no typecheck e nos testes de integração do repositório antes de merge. Este pacote não altera o GitHub nem inclui VSL final.
