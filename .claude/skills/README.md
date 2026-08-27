# Skills do projeto

Cada skill vive em sua própria pasta aqui dentro, com um arquivo `SKILL.md`:

```
.claude/skills/
  nome-da-skill/
    SKILL.md          # obrigatório
    referencias.md    # opcional: arquivos de apoio, lidos sob demanda
```

## Formato do SKILL.md

```markdown
---
name: nome-da-skill
description: Quando usar esta skill. É por esta linha que o Claude decide
  carregá-la, então descreva o gatilho, não só o assunto.
---

Instruções que o Claude deve seguir quando a skill for carregada.
```

- `name` em **kebab-case**, igual ao nome da pasta.
- `description` é o que mais importa: ela é o único texto sempre em contexto.
  Escreva "Use ao criar/editar telas de exercício de teoria musical..." em vez
  de "Skill de frontend".
- `allowed-tools` (opcional) restringe as ferramentas durante a skill.

## Como usar

- **Automático**: o Claude carrega a skill sozinho quando a `description` bate
  com a tarefa.
- **Manual**: digite `/nome-da-skill` no chat.

## Ideias de skills de frontend para este app

- Padrões de componente de UI (tema claro/escuro, variantes `.web.tsx`).
- Convenções de tela nova no `expo-router` (`src/app/`, rotas tipadas).
- Renderização de notação musical (pentagrama, cifras, teclado/braço).
- Acessibilidade em exercícios de ouvido e de leitura.
