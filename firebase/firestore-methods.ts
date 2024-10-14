import {
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  WhereFilterOp,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { app } from './app';
import { CompetitionsCollectionProps, LeaguesCollectionProps, TeamsCollectionProps, UsersCollectionProps } from './db-types';

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  leagues: 'leagues',
  competitions: 'competitions',
  teams: 'teams',
};

export const FIRESTORE_DOCUMENTS = {
  uid: 'uid', // Dyanmic for "users"
  id: 'id', // Dynamic for "leagues"
};

export const firestoreMethods = (
  collectionName: keyof typeof FIRESTORE_COLLECTIONS,
  documentName: keyof typeof FIRESTORE_DOCUMENTS,
) => {
  // GET THE DOCUMENT REFERENCE
  const getDocRef = () => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    const databaseDocument = doc(databaseCollection, documentName);
    return databaseDocument;
  };

  const createDocument = async (document: any) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const docRef = await addDoc(databaseCollection, document);
      const docSnapshot = await getDoc(docRef);
      return {
        ...docSnapshot.data(),
        id: docRef.id
      };
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const getDocsByQuery = async (field: string, operator: WhereFilterOp, value: any) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const q = query(databaseCollection, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => {return {id: doc.id, ...doc.data()}});
      if (collectionName === "competitions") {
        return docs ? docs as CompetitionsCollectionProps[] : [];
      } else if (collectionName === "leagues") {
        return docs ? docs as LeaguesCollectionProps[] : [];
      } else if (collectionName === "teams") {
        return docs ? docs as TeamsCollectionProps[] : [];
      } else if (collectionName === "users") {
        return docs ? docs as UsersCollectionProps[] : [];
      }
      return docs ? docs as any : [];
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const getDocsByChunk = async (chunkSize: number, startFrom?: QueryDocumentSnapshot) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const q = startFrom 
        ? query(databaseCollection, startAfter(startFrom), limit(chunkSize)) 
        : query(databaseCollection, limit(chunkSize));
      const querySnapshot = await getDocs(q);
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.size === chunkSize;
      const docs = querySnapshot.docs.map(doc => {return {id: doc.id, ...doc.data()}});
      return { docs, lastVisible: newLastVisible, hasMore };
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }

  // GET THE DOCUMENT SNAPSHOT
  const getDocSnapshot = async () => {
    const document = getDocRef();
    return await getDoc(document);
  };

  // GET DATA FROM A DOCUMENT
  // const getDocumentData = async <FieldsProps>() => {
  //   const documentSnapshot = await getDocSnapshot();
  //   const fields = documentSnapshot.data();
  //   if (fields) return fields as FieldsProps;
  // };

  // GET DATA FROM A DOCUMENT
  const getDocumentData = async () => {
    const documentSnapshot = await getDocSnapshot();
    const data = documentSnapshot.data();
    return data ? { id: documentSnapshot.id, ...data } : null;
  };

  const createField = async (field: string, value: any) => {
    if (field && value) {
      const docRef = getDocRef();
      const updatingFields = { [field]: value };
      await setDoc(docRef, updatingFields, { merge: true });
      return true;
    }
  };

  // REPLACE THE DATA OF AN ALREADY EXSTING FIELD
  const replaceField = async (field: string, value: any) => {
    if (field && value) {
      const docRef = getDocRef();
      const updatingFields = { [field]: value };
      await updateDoc(docRef, updatingFields);
      return true;
    }
  };

  // ADD DATA TO AN ALREADY EXSTING FIELD WITHOUT REMOVING THE EXISTING DATA
  const addDataToField = async (
    field: string,
    value: any,
    fieldType: 'array' | 'other', // If the field to update is an "array" then "push" the value inside of it instead of replacing it
  ) => {
    if (field && value) {
      const docRef = getDocRef();

      const fieldValue = fieldType === 'array' ? arrayUnion(value) : value;
      const updatingFields = { [field]: fieldValue };
      
      await updateDoc(docRef, updatingFields);
      return true;
    }
  };

  const deleteDocumentsByQuery = async (field: string, operator: WhereFilterOp, value: any) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const q = query(databaseCollection, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(database);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    
      await batch.commit();
      console.log("Documenti cancellati con successo.");
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }

  const deleteDocument = async () => {
    const docRef = getDocRef();
    await deleteDoc(docRef);
    return true;
  }

  return {
    getDocRef,
    getDocumentData,
    getDocsByQuery,
    getDocsByChunk,
    createDocument,
    createField,
    addDataToField,
    replaceField,
    deleteDocument,
    deleteDocumentsByQuery
  };
};
