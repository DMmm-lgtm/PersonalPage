import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
  // 仅在开发时提示环境变量缺失
  console.warn('VITE_SUPABASE_URL 未设置，請在 .env.local 中配置');
}

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY 未设置，請在 .env.local 中配置');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


