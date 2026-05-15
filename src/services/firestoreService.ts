import {
  doc,
  collection,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { VerseCard } from '../types'

function requireDb() {
  if (!db) throw new Error('Firebase Firestore 尚未設定。')
  return db
}

interface UserProfile {
  displayName: string
  email: string
  photoURL: string
  lastDrawDate: string
}

export async function ensureUserProfile(
  uid: string,
  profile: Omit<UserProfile, 'lastDrawDate'>
): Promise<void> {
  const ref = doc(requireDb(), 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { ...profile, lastDrawDate: '', createdAt: serverTimestamp() })
  }
}

export async function getUserLastDrawDate(uid: string): Promise<string> {
  const snap = await getDoc(doc(requireDb(), 'users', uid))
  if (!snap.exists()) return ''
  return (snap.data() as UserProfile).lastDrawDate ?? ''
}

export async function updateLastDrawDate(uid: string, date: string): Promise<void> {
  await updateDoc(doc(requireDb(), 'users', uid), { lastDrawDate: date })
}

type StoredCard = Omit<VerseCard, 'theme'> & { themeId: string }

function toStored(card: VerseCard): StoredCard {
  const { theme, ...rest } = card
  return { ...rest, themeId: theme.id }
}

export async function saveCard(uid: string, card: VerseCard): Promise<void> {
  const ref = doc(requireDb(), 'users', uid, 'cards', card.id)
  await setDoc(ref, toStored(card))
}

export async function updateCardAnalysis(
  uid: string,
  cardId: string,
  aiAnalysis: string
): Promise<void> {
  const ref = doc(requireDb(), 'users', uid, 'cards', cardId)
  await updateDoc(ref, { aiAnalysis })
}

export async function loadCards(uid: string): Promise<StoredCard[]> {
  const q = query(
    collection(requireDb(), 'users', uid, 'cards'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data() as StoredCard)
}

export type { StoredCard }
