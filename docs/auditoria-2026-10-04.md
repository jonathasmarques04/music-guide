# Correções da auditoria de 04/10/2026

## Corrigido no código

- Providers de progresso, instrumento e revisão são remontados por identidade. Dados de uma conta não aparecem durante o carregamento de outra.
- Revisões são persistidas por conta no aparelho. A interface avisa quando o armazenamento local falha.
- Notas e operações pendentes são persistidas por conta, com nova tentativa ao reabrir, voltar ao primeiro plano, repetir avaliação ou a cada 30 segundos com o app aberto.
- Respostas atrasadas são conciliadas pela melhor nota; reinícios pendentes são aplicados antes das novas gravações. Requisições de progresso fixam o token da conta de origem.
- Exclusão de avatar só informa sucesso se a remoção do arquivo e a atualização do perfil funcionarem.
- Fotos usam URLs assinadas por uma hora; o SQL fecha o bucket e restringe leitura/listagem ao dono. Dados de perfil também são ocultados imediatamente ao trocar de conta.
- Cadastro usa mensagem uniforme para nova conta e conta existente. Erros desconhecidos e erros recebidos por link não exibem mensagens técnicas arbitrárias.
- Quiz e flashcards respeitam o bloqueio da trilha em links diretos; o registro de nota também verifica módulo e intervalo numérico.
- Validação local rejeita múltiplos arrobas. A explicação de G7 distingue dominante X7 de Bm7♭5, que também contém trítono.
- O verificador Supabase reprova respostas contendo dados anônimos e erros HTTP. Ele informa resultados inconclusivos e não afirma verificar todo o schema ou a RLS.

## Verificação local

```sh
npm test
npm run typecheck
npm run contraste
```

A suíte usa o código TypeScript real com hooks, SDK, armazenamento e relógios de execução simulados; não lê `.env` nem usa contas reais. Os testes agora afirmam o comportamento corrigido. Inclui isolamento de contas, persistência/reenvio, respostas atrasadas, reinício durante gravação, exclusão de foto, rotas bloqueadas, respostas do verificador e integridade de 18 módulos/124 questões/140 flashcards, com 100.000 transições de repetição.

Execução confirmada: 17 testes em `tests/seguranca.test.cjs`, checagem de tipos e exportação web aprovados. A checagem de conteúdo passou durante a auditoria inicial; sua versão incorporada à suíte completa não foi reexecutada porque a autorização para a execução adicional fora do ambiente restrito foi recusada. A tela inicial corrigida foi carregada no navegador local.

## Pendência externa

O Supabase configurado não resolveu por DNS durante a auditoria. Não há confirmação de implantação das políticas nem de ausência de vazamento no banco real. Aplicar a seção 3 de `supabase/schema.sql` e testar com duas contas antes de considerar a correção de Storage concluída. O push de código não aplica a migração. URLs de fotos previamente compartilhadas podem ter cópias em caches ou dispositivos; fechar o bucket não remove essas cópias.

Revisões continuam locais ao aparelho, separadas por conta; não há sincronização de flashcards entre aparelhos nesta mudança. Testes em Android/iOS e autenticação real de ponta a ponta permanecem necessários.
