// import { createSignal } from "solid-js";
// import { deleteKVStorage, setKVStorage } from "minip-bridge";

// const storage: any = {};
// const storagePromise: any = {};

// window.addEventListener("storage", (e) => {
//   const { key, newValue } = e;
//   if (key && storage[key]) {
//     const [_, setIt] = storage[key].inner;
//     if (newValue) setIt(JSON.parse(newValue));
//     else setIt(null);
//   }
// });

// export function useStorage(key: string, initVal: any = null) {
//   if (!key) {
//     throw new Error("key must set");
//   }

//   if (storage[key]) {
//     return storage[key].outer;
//   }

//   const [_getVal, _setVal] = createSignal(initVal);
//   storage[key] = {
//     inner: [_getVal, _setVal],
//   };

//   const getVal = _getVal;
//   const setVal = (newVal: any) => {
//     if (newVal) {
//       setKVStorage(key, JSON.stringify(newVal));
//       _setVal(newVal);
//     } else {
//       deleteKVStorage(key);
//       _setVal(null);
//     }
//   };

//   storage[key].outer = [getVal, setVal];
//   return [getVal, setVal];
// }
// export async function useStorageAsync(key: string, initVal: any) {
//   if (!key) {
//     throw new Error("key must set");
//   }

//   if (storage[key]) {
//     return storage[key].outer;
//   }

//   if (storagePromise[key]) {
//     await storagePromise[key];
//     return storage[key].outer;
//   }
//   const [_getVal, _setVal] = createSignal(initVal);

//   const realValue = await storagePromise[key];
//   delete storagePromise[key];
//   _setVal(JSON.parse(realValue));

//   const getVal = _getVal;
//   const setVal = (newVal: any) => {
//     if (newVal) {
//       setKVStorage(key, JSON.stringify(newVal));
//       _setVal(newVal);
//     } else {
//       deleteKVStorage(key);
//       _setVal(null);
//     }
//   };

//   storage[key] = {
//     inner: [_getVal, _setVal],
//     outer: [getVal, setVal],
//   };
//   return [getVal, setVal];
// }
