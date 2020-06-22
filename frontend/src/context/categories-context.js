import React from 'react';

const CategoriesContext = React.createContext({
    categories: [],
    setCategories: () => {}
});

export default CategoriesContext;