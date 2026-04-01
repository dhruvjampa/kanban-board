/*
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSignIn() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        supabase.auth.signInAnonymously()
      }
    })
  }, [])
}
*/

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSignIn() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        supabase.auth.signInAnonymously().then(({ data, error }) => {
          console.log('Sign in result:', data, error)
        })
      } else {
        console.log('Existing session:', session.user.id)
      }
    })
  }, [])
}