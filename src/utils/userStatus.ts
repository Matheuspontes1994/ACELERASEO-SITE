import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export async function updateUserActiveStatus(role: 'admin' | 'client', customName?: string, customEmail?: string) {
  if (!auth || !auth.currentUser) return;
  const user = auth.currentUser;
  const uid = user.uid;
  const email = user.email || customEmail || 'sem-email';
  const name = user.displayName || customName || email.split('@')[0];
  
  try {
    await setDoc(doc(db, 'user_status', uid), {
      email,
      name,
      role,
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Erro ao atualizar status do usuario:", err);
  }
}
