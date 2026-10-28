# Fusion TD — atualização de torres elétricas e Vessel

## Torres adicionadas
- **Lightning Rod** (Tier 0): feixe elétrico com encadeamento de até 3 inimigos; o dano total é dividido entre os alvos atingidos.
- **Raygun** (Tier 1): Lightning Rod + Shooter. Lança uma esfera de energia lenta e penetrante; a aura aplica pulsos elétricos aos inimigos próximos durante a passagem.
- **Bolt Launcher** (Tier 1): Lightning Rod + Cannon. Invoca raios em seu alcance; quando dispara, tem 50% de chance de escolher um inimigo e 50% de chance de escolher um ponto aleatório.
- **Tesla Rod** (Tier 1): Lightning Rod + Lightning Rod. Mantém o feixe em um inimigo e acelera gradualmente os pulsos de dano, sem encadeamento.

## Inimigo adicionado
- **Vessel**: inseto marrom blindado, com muita vida. Ao receber dano letal pela primeira vez, transforma-se em casulo com a vida cheia e fica imóvel por 2 segundos. Se o casulo sobreviver, o Vessel revive com 75% da vida máxima. O inimigo começa a aparecer na onda 5.

## Arquivos principais alterados
- `lib/game/data.ts`: dados, estatísticas, catálogo, receitas de fusão e ondas.
- `lib/game/engine.ts`: ataques, projéteis, efeitos elétricos, arte Canvas e fase de casulo.
- `components/game/game-screen.tsx`: construção do Lightning Rod, atalho `3` e estatísticas contextuais.

## Validação executada
- TypeScript estrito para `lib/game/data.ts` e `lib/game/engine.ts`.
- Transpilação sintática dos arquivos TS/TSX do projeto.
- Testes de simulação para receitas, encadeamento, ataques elétricos e Vessel.

O build integral do Next.js não foi executado porque a instalação de dependências excedeu o limite de execução disponível no ambiente.
