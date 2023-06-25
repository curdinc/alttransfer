'use client';

import s from './Navbar.module.css';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  return (
    <button
      className={s.link}
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/signin');
      }}
    >
      Sign out
    </button>
  );
}
