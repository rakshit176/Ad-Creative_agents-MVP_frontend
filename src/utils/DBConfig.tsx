//---------------- Save data to IndexedDB-------------------
export function saveToIndexedDB(dataToSave: string, selectedStudio: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const request = window.indexedDB.open('MyDatabase', 1);

        request.onerror = function (event) {
            console.log('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onupgradeneeded = function (event) {
            const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

            if (!db.objectStoreNames.contains('data')) {
                db.createObjectStore('data');
            }
        };

        request.onsuccess = function (event) {
            const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

            const transaction = db.transaction(['data'], 'readwrite');
            const objectStore = transaction.objectStore('data');

            objectStore.put(dataToSave, selectedStudio);

            transaction.oncomplete = function () {
                // console.log('Data saved successfully.'); //test
                // console.log(dataToSave); //test
                resolve();
            };

            transaction.onerror = function (event) {
                console.log('IndexedDB transaction error:', request.error);
                reject(request.error);
            };
        };
    });
}

//---------------- Get data from IndexedDB-------------------
export function retrieveFromIndexedDB(selectedStudio: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
        const request = window.indexedDB.open('MyDatabase', 1);

        request.onerror = function (event) {
            console.log('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = function (event) {
            const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

            const transaction = db.transaction(['data'], 'readonly');
            const objectStore = transaction.objectStore('data');

            const getRequest = objectStore.get(selectedStudio);

            getRequest.onsuccess = function (event) {
                const data = (event.target as IDBRequest).result as string;
                resolve(data);
            };

            getRequest.onerror = function (event) {
                console.log('Error retrieving data:', getRequest.error);
                reject(getRequest.error);
            };
        };

        request.onupgradeneeded = function (event) {
            const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

            if (!db.objectStoreNames.contains('data')) {
                db.createObjectStore('data');
            }
        };
    });
}
