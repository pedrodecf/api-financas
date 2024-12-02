export function filterObjects<T extends Record<string, unknown>>(object: T) {
   const entries = Object.entries(object);
 
   const entriesFiltered = entries?.filter((entry) => {
     if (typeof entry[1] === 'boolean') {
       return true;
     }
 
     return entry[1] ?? false;
   });
 
   return Object.fromEntries(entriesFiltered) as T;
 }
 