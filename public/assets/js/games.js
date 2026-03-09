import { supabase } from './api.js';

export const fetchGames = async () => {
    const { data, error } = await supabase.from('games').select('*').eq('is_active', true);
    if (error) console.error('Fetch games error:', error);
    return data || [];
};
