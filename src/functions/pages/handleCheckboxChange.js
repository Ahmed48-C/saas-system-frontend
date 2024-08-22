export const handleCheckboxChange = (id, selected, setSelected, handleNumSelected, records, handleIsSelectedAll) => {
    const currentIndex = selected.indexOf(id);
    const newSelected = [...selected];

    if (currentIndex === -1) {
        newSelected.push(id);
    } else {
        newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
    handleNumSelected(newSelected.length);

    if (newSelected.length === records.data.length) {
        handleIsSelectedAll(true);
    } else {
        handleIsSelectedAll(false);
    }
};
