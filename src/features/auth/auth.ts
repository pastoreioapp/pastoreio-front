/**
 * Funções auxiliares para autenticação com Supabase
 * 
 * Este arquivo contém funções para buscar dados do usuário
 * e mapear para o formato esperado pelo sistema.
 */
import { createClient } from '../supabase/client'
import { LoggedUserResponse, Perfil } from '@/features/auth/types'
import type { User } from '@supabase/supabase-js'

/**
 * Busca os perfis do usuário do Supabase
 * 
 * Tenta buscar de uma tabela `user_profiles` no Postgres.
 * Se a tabela não existir ou não houver dados, usa metadata do usuário.
 * Fallback final: retorna MEMBRO como perfil padrão.
 * 
 * TODO: Criar tabela `user_profiles` no Supabase com estrutura:
 *   - user_id (uuid, foreign key para auth.users)
 *   - profile (text ou array de text)
 */
async function getUserProfiles(userId: string, userMetadata?: any): Promise<string[]> {
  const supabase = createClient()
  
  // Tenta buscar de tabela user_profiles (se existir)
  try {
    const { data: profileData, error } = await supabase
      .from('user_profiles')
      .select('profile')
      .eq('user_id', userId)
      .single()
    
    if (!error && profileData) {
      return Array.isArray(profileData.profile) 
        ? profileData.profile 
        : [profileData.profile]
    }
  } catch (error) {
    // Tabela não existe ou erro na query - continua para fallback
    console.debug('user_profiles table not found or error, using fallback');
  }
  
  // Fallback 1: Tenta usar metadata do usuário
  if (userMetadata?.profiles && Array.isArray(userMetadata.profiles)) {
    return userMetadata.profiles
  }
  
  if (userMetadata?.profile) {
    return Array.isArray(userMetadata.profile)
      ? userMetadata.profile
      : [userMetadata.profile]
  }
  
  // Fallback 2: Retorna MEMBRO como padrão
  return [Perfil.MEMBRO]
}

// TODO: ver se realmente precisa mapear para LoggedUserResponse
export async function mapSupabaseUserToLoggedUser(
  user: User | null
): Promise<LoggedUserResponse | null> {
  if (!user) return null

  const profiles = await getUserProfiles(user.id, user.user_metadata)
  
  // Extrai nome completo de metadata ou usa email como fallback
  const fullName = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'Usuário'
  
  const nameParts = fullName.split(' ')
  const nome = nameParts[0] || ''
  const sobrenome = nameParts.slice(1).join(' ') || ''

  // Converte UUID do Supabase para número (hash simples)
  // TODO: Considerar migrar LoggedUserResponse.id para string/UUID
  // ou criar uma tabela de mapeamento user_id -> internal_id
  const numericId = user.id.split('-').reduce((acc, part) => {
    return acc + parseInt(part.slice(0, 4), 16);
  }, 0) % 2147483647; // Limita ao range de int32

  return {
    id: numericId || 1, // Garante que sempre há um ID válido
    nome,
    sobrenome,
    login: user.email || '',
    email: user.email || '',
    telefone: user.user_metadata?.phone || '',
    perfis: profiles,
    isUsuarioExterno: false, // TODO: Implementar lógica de usuário externo se necessário
  }
}

/**
 * Busca o usuário atual autenticado e retorna no formato LoggedUserResponse
 */
export async function getCurrentUser(): Promise<LoggedUserResponse | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return mapSupabaseUserToLoggedUser(user)
}
