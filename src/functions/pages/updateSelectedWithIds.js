
export const updateSelectedWithIds = (model, ids, setIds, handleSelected, handleNumSelected) => {
    if (ids[model] && ids[model].length > 0) {
        handleSelected(prevSelected => [...prevSelected, ...ids[model]]);
        handleNumSelected(ids[model].length);
        setIds(prevIds => ({ ...prevIds, [model]: [] })); // Clear the ids for the specific model
    }
};
