import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { WorkEntry } from '../types';

const COLLECTION = 'workEntries';

// ─── Real‑time listener ──────────────────────────────────────────────────────
export function subscribeToEntries(
    callback: (entries: WorkEntry[]) => void
): () => void {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const entries: WorkEntry[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                date: data.date ?? '',
                customerName: data.customerName ?? '',
                areaOfWork: data.areaOfWork ?? '',
                subParticular: data.subParticular ?? '',
                assignedTo: data.assignedTo ?? 'Unassigned',
                assignedToInitials: data.assignedToInitials ?? '',
                assignedDate: data.assignedDate ?? '—',
                status: data.status ?? 'Not Assigned',
                billed: data.billed ?? 'No',
                invoiceNo: data.invoiceNo ?? '—',
                amount: Number(data.amount) || 0,
                paymentStatus: data.paymentStatus ?? 'Not Received',
                description: data.description ?? '',
                dueDate: data.dueDate ?? '',
                priority: data.priority ?? 'Medium',
                paymentMode: data.paymentMode ?? '',
            } as WorkEntry;
        });
        callback(entries);
    });
}

// ─── Add ────────────────────────────────────────────────────────────────────
export async function addEntry(
    entry: Omit<WorkEntry, 'id'>
): Promise<string> {
    const doc_ref = await addDoc(collection(db, COLLECTION), {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return doc_ref.id;
}

// ─── Update ─────────────────────────────────────────────────────────────────
export async function updateEntry(
    id: string,
    data: Partial<Omit<WorkEntry, 'id'>>
): Promise<void> {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ─── Delete ─────────────────────────────────────────────────────────────────
export async function deleteEntry(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
