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
  writeBatch,
  DocumentReference,
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
  let queryFilters: any;
  // GET THE DOCUMENT REFERENCE
  const getDocRef = (documentId?: string) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    const documentToGet = documentId ? documentId : documentName;
    if (!documentToGet) {
      console.error('No document ID specified for collection: ', collectionName);
      return null;
    }
    const databaseDocument = doc(databaseCollection, documentToGet);
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

  const setWhereFilter = (field: string, operator: WhereFilterOp, value: any) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    if (queryFilters) {
      queryFilters = query(queryFilters, where(field, operator, value));
    } else {
      queryFilters = query(databaseCollection, where(field, operator, value));
    }
  };

  const executeQuery = async () => {
    if (!queryFilters) return;
    try {
      const querySnapshot = await getDocs(queryFilters);
      const docs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return data ? { id: doc.id, ...data } : { id: doc.id };
      });

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
    if (!document) return null;
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
    if (!documentSnapshot || !documentSnapshot.exists()) return null;
    const data = documentSnapshot.data();
    return data ? { id: documentSnapshot.id, ...data } : null;
  };

  const getDocumentDataByRef = async (documentRef: DocumentReference) => {
    const documentSnapshot = await getDoc(documentRef);
    if (!documentSnapshot || !documentSnapshot.exists()) return null;
    const data = documentSnapshot.data();
    return data ? { id: documentSnapshot.id, ...data } : null;
  }


  const createField = async (field: string, value: any) => {
    if (field && value) {
      const docRef = getDocRef();
      if (!docRef) return false;
      const updatingFields = { [field]: value };
      await setDoc(docRef, updatingFields, { merge: true });
      return true;
    }
  };

  // REPLACE THE DATA OF AN ALREADY EXSTING FIELD
  const replaceField = async (field: string, value: any) => {
    if (field && value) {
      const docRef = getDocRef();
      if (!docRef) return false;
      const updatingFields = { [field]: value };
      await updateDoc(docRef, updatingFields);
      return true;
    }
  };

  const replaceRefField = async (field: string, value: DocumentReference) => {
    if (field && value) {
      const docRef = getDocRef();
      if (!docRef) return false;
      // const getUpdateDocRef = getDocRef(value);
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
      if (!docRef) return false;

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
      // console.log("Documenti cancellati con successo.");
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }

  const deleteDocument = async () => {
    const docRef = getDocRef();
    if (!docRef) return false;
    await deleteDoc(docRef);
    return true;
  }

  return {
    getDocRef,
    getDocumentData,
    getDocsByQuery,
    getDocsByChunk,
    getDocumentDataByRef,
    createDocument,
    createField,
    addDataToField,
    replaceField,
    replaceRefField,
    deleteDocument,
    deleteDocumentsByQuery,
    setWhereFilter,
    executeQuery
  };
};
