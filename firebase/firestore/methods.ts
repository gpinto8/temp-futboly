import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS, FIRESTORE_DOCUMENTS } from './data';
import { app } from '../app';

const getDocument = (
  collectionName: keyof typeof FIRESTORE_COLLECTIONS,
  documentName: keyof typeof FIRESTORE_DOCUMENTS
) => {
  const database = getFirestore(app);
  const databaseCollection = collection(database, collectionName);
  const databaseDocument = doc(databaseCollection, documentName);
  return databaseDocument;
};

export const getFirestoreData = async (
  collectionName: keyof typeof FIRESTORE_COLLECTIONS,
  documentName: keyof typeof FIRESTORE_DOCUMENTS
) => {
  if (!collectionName && !documentName) return;

  const document = getDocument(collectionName, documentName);
  const documentSnapshot = await getDoc(document);
  const fields = documentSnapshot.data();

  return fields;
};

export const setFirestoreData = async (
  collectionName: keyof typeof FIRESTORE_COLLECTIONS,
  documentName: keyof typeof FIRESTORE_DOCUMENTS,
  fields: any
) => {
  if (!collectionName && !documentName && !fields) return;

  const firestoreDocument = getDocument(collectionName, documentName);
  await setDoc(firestoreDocument, fields, { merge: true });
};
