# Configuração do Supabase

## Criar Tabela de Perfis (Opcional)

Para gerenciar perfis de usuário, crie uma tabela no Supabase:

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  profile TEXT[] NOT NULL DEFAULT ARRAY['MEMBRO'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver seus próprios perfis
CREATE POLICY "Users can view own profiles"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Política: apenas admins podem atualizar perfis (ajuste conforme necessário)
CREATE POLICY "Admins can update profiles"
  ON user_profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Nota:** Se você não criar esta tabela, o sistema usará `MEMBRO` como perfil padrão para todos os usuários.

## Estrutura de Perfis

Os perfis disponíveis estão definidos em `src/features/auth/types.ts`:

- `ADMINISTRADOR_SISTEMA`
- `ADMINISTRADOR_IGREJA`
- `LIDER_CELULA`
- `MEMBRO`

## Testar a Autenticação

1. Execute o projeto: `npm run dev`
2. Acesse `/login` ou `/register`
3. Teste o registro e login com email/senha
4. Teste o login com Google (se configurado)

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que está usando a `anon key`, não a `service_role key`

### Perfis não estão sendo carregados
- Se você criou a tabela `user_profiles`, verifique se o RLS está configurado corretamente
- Verifique se há dados na tabela para o usuário
- O sistema usará `MEMBRO` como padrão se não encontrar perfis

## Próximos Passos

- [ ] Configurar email templates no Supabase
- [ ] Implementar recuperação de senha
- [ ] Adicionar mais providers OAuth (Facebook, Apple, etc)
- [ ] Implementar sistema de permissões mais granular
- [ ] Adicionar logs de auditoria
