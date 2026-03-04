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
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { Customer, Member, WorkArea } from '../types';

// --- Customers ---
export function subscribeToCustomers(callback: (data: Customer[]) => void) {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Customer));
        callback(data);
    });
}

export async function addCustomer(data: Omit<Customer, 'id'>) {
    return addDoc(collection(db, 'customers'), { ...data, createdAt: serverTimestamp() });
}

export async function deleteCustomer(id: string) {
    return deleteDoc(doc(db, 'customers', id));
}

// --- Members ---
export function subscribeToMembers(callback: (data: Member[]) => void) {
    const q = query(collection(db, 'members'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Member));
        callback(data);
    });
}

export async function addMember(data: Omit<Member, 'id'>) {
    return addDoc(collection(db, 'members'), { ...data, createdAt: serverTimestamp() });
}

export async function deleteMember(id: string) {
    return deleteDoc(doc(db, 'members', id));
}

// --- Work Areas ---
export function subscribeToWorkAreas(callback: (data: WorkArea[]) => void) {
    const q = query(collection(db, 'workAreas'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(d => ({
            id: d.id,
            name: d.data().name || '',
            subParticulars: d.data().subParticulars || []
        } as WorkArea));
        callback(data);
    });
}

export async function addWorkArea(data: Omit<WorkArea, 'id'>) {
    return addDoc(collection(db, 'workAreas'), { ...data, createdAt: serverTimestamp() });
}

export async function deleteWorkArea(id: string) {
    return deleteDoc(doc(db, 'workAreas', id));
}

export async function addSubParticular(id: string, sub: string) {
    const ref = doc(db, 'workAreas', id);
    return updateDoc(ref, {
        subParticulars: arrayUnion(sub),
        updatedAt: serverTimestamp()
    });
}

export async function removeSubParticular(id: string, sub: string) {
    const ref = doc(db, 'workAreas', id);
    return updateDoc(ref, {
        subParticulars: arrayRemove(sub),
        updatedAt: serverTimestamp()
    });
}

export async function updateWorkArea(id: string, data: Partial<WorkArea>) {
    const ref = doc(db, 'workAreas', id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
