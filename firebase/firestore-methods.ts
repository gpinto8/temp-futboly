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
  arrayRemove,
  deleteField,
} from 'firebase/firestore';
import { app } from './app';
import {
  CompetitionsCollectionProps,
  LeaguesCollectionProps,
  UsersCollectionProps,
} from './db-types';

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
      console.error(
        'No document ID specified for collection: ',
        collectionName,
      );
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
        id: docRef.id,
      };
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const setWhereFilter = (
    field: string,
    operator: WhereFilterOp,
    value: any,
  ) => {
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
      const docs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data ? { id: doc.id, ...data } : { id: doc.id };
      });

      if (collectionName === 'competitions') {
        return docs ? (docs as CompetitionsCollectionProps[]) : [];
      } else if (collectionName === 'leagues') {
        return docs ? (docs as LeaguesCollectionProps[]) : [];
      } else if (collectionName === 'users') {
        return docs ? (docs as UsersCollectionProps[]) : [];
      }

      return docs ? (docs as any) : [];
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const getDocsByQuery = async (
    field: string,
    operator: WhereFilterOp,
    value: any,
  ) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const q = query(databaseCollection, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      if (collectionName === 'competitions') {
        return docs ? (docs as CompetitionsCollectionProps[]) : [];
      } else if (collectionName === 'leagues') {
        return docs ? (docs as LeaguesCollectionProps[]) : [];
      } else if (collectionName === 'users') {
        return docs ? (docs as UsersCollectionProps[]) : [];
      }

      return docs ? (docs as any) : [];
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const getDocsByChunk = async (
    chunkSize: number,
    startFrom?: QueryDocumentSnapshot,
  ) => {
    const database = getFirestore(app);
    const databaseCollection = collection(database, collectionName);
    try {
      const q = startFrom
        ? query(databaseCollection, startAfter(startFrom), limit(chunkSize))
        : query(databaseCollection, limit(chunkSize));
      const querySnapshot = await getDocs(q);
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.size === chunkSize;
      const docs = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      return { docs, lastVisible: newLastVisible, hasMore };
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  // GET THE DOCUMENT SNAPSHOT
  const getDocSnapshot = async () => {
    const document = getDocRef();
    if (!document) return null;
    return await getDoc(document);
  };

  // GET FIELD DATA BY THE FIELD KEY
  const getFieldData = async (key: string) => {
    if (key) {
      const docSnapshot = await getDocSnapshot();
      const value = docSnapshot?.get(key);
      if (value) return value;
    }
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
  };

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

  const deleteDocumentsByQuery = async (
    field: string,
    operator: WhereFilterOp,
    value: any,
  ) => {
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
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const deleteDocument = async () => {
    const docRef = getDocRef();
    if (!docRef) return false;
    await deleteDoc(docRef);
    return true;
  };

  const deleteValueFromArrayField = async (
    key: string, // TODO: map all possible collection, documents and fields possible in TS so there's no typos (in all functions), since now we just accept strings
    value: any,
  ) => {
    if (key && value) {
      const docRef = getDocRef();
      if (docRef) await updateDoc(docRef, { [key]: arrayRemove(value) });
    }
  };

  // DELETE THE FIELD FROM THE ONLY IF THE CURRENT VALUE IS THE SAME AS THE ONE YOU ARE PASSING (e.g the "activeLeague" of "users" .. because maybe you want to delete it if the current league you are exiting from is the same as the current one)
  const deleteFieldMatchingValue = async (
    key: string,
    value: any,
    comparator: (currentValue: any, value: any) => boolean, // We are not sure if the values to compare are primite values or not, so we just pass the comparison to the dev that want to use it
  ) => {
    if (key && value) {
      const docRef = getDocRef();
      if (docRef) {
        const fieldValue = await getFieldData(key);
        const matches = comparator(fieldValue, value);
        if (matches) await updateDoc(docRef, { [key]: deleteField() });
      }
    }
  };

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
    executeQuery,
    deleteValueFromArrayField,
    deleteFieldMatchingValue,
  };
};
