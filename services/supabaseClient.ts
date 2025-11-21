import { createClient } from '@supabase/supabase-js';
import { DiscoveryData } from '../types';

// Credentials provided by user
const SUPABASE_URL = 'https://ruvvjstalklhlyajnwkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RFlZ7tRUTo9Axsk-rAkaDw_G8SDNHpa'; // Public/Anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- AUTH FUNCTIONS ---

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// --- DB FUNCTIONS ---

export const saveProjectToDB = async (data: DiscoveryData) => {
  // We store the heavy JSON structure in 'content' column
  // We extract high-level fields for easier SQL filtering/sorting
  const payload = {
    status: data.status,
    project_name: data.projectName || 'Proyecto Sin Nombre',
    ecosystem: data.ecosystemPreference,
    content: data, // Store the full object
    updated_at: new Date().toISOString()
  };

  // Check if we are updating an existing ID (if it matches UUID format) or inserting new
  // Note: Since client creates a random UUID locally, we might want to upsert based on that ID if possible,
  // or let Supabase generate the ID and return it.
  
  // Strategy: Insert always for this MVP to avoid ID collisions with local random UUIDs, 
  // or Upsert if we had a robust ID system. 
  // Let's treat the 'id' in DiscoveryData as the local reference, but rely on Supabase ID for persistence if needed.
  // However, to keep it simple: We will upsert based on the ID if it exists in our DB, otherwise insert.

  const { data: savedData, error } = await supabase
    .from('projects')
    .upsert({ 
        id: data.id && data.id.length > 10 ? data.id : undefined, // Only send ID if it looks valid, otherwise let DB gen one
        ...payload 
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
  return savedData;
};

export const getProjectsFromDB = async (): Promise<DiscoveryData[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  // Map back to DiscoveryData structure
  // We merge the DB metadata (id, status) with the JSON content
  return data.map((row: any) => ({
    ...row.content,
    id: row.id,
    status: row.status,
    submissionDate: new Date(row.created_at).toLocaleDateString(),
  }));
};