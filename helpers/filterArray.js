exports.filterArray = (itemToDelete, items) => {
    return items.filter(item => {
        return item != itemToDelete;
    });
}