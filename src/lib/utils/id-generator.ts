
const STORAGE_KEYS = 'currIdNumber';
const RECIPE_PREFIX = 'recp_';

let currentId = 0;

export const initCurrentIdData = (): number => {
    if(typeof window === 'undefined'){
        return 0;
    }
    let result = 0;
    try {
        const savedIdNumber = localStorage.getItem(STORAGE_KEYS);
        if(savedIdNumber) {
            console.log('localStorage has currentNumber data. Loading...');
            result = parseInt(savedIdNumber);
        }
    } catch (error) {
        console.warn('Invalid currentNumber data found in localStorage. Clearing localStorage');
        localStorage.removeItem(STORAGE_KEYS);
    }
    console.log('current id number: ', result);
    return result;
}

const persistCurrentId = () => {
    localStorage.setItem(STORAGE_KEYS, currentId.toString());
    console.log('current id persist to localStorage');
}

// run twice (SSR --> 0) and CSR(return data from localStorage)
//currentId = fetchCurrentId();

// generate recipe id
export const generateRecipeId = () => {
    currentId += 1;
    // persist current id
    persistCurrentId();
    return RECIPE_PREFIX + currentId.toString().padStart(3, '0');
}