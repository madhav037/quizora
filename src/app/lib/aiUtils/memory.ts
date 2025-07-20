// lib/memory.ts

type Memory = {
  user_id: string;
  topic: string;
  last_prompt: string;
  last_response: string;
  last_used_at: string;
}

export type { Memory };

export async function getMemory(user_id: string, supabase: any): Promise<Memory | null> {
  const { data, error } = await supabase
    .from('user_quiz_memory')
    .select('user_id, topic, last_prompt, last_response, last_used_at')
    .eq('user_id', user_id)
    .single()

  if (error) return null
  return data
}

export async function updateMemory(user_id: string, newMemory: string, supabase: any) {
  await supabase
    .from('user_quiz_memory')
    .upsert({ user_id, memory: newMemory })
}
