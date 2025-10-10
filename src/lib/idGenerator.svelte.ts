
const idGenerator = $state({
    current: 0 
});

export const generateNextId = () => {
    idGenerator.current += 1;
    return idGenerator.current;
}