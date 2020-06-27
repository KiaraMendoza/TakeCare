import React from 'react';

const CategoriesContext = React.createContext({
    categories: [],
    setCategories: () => {},
    races: [],
    setRaces: () => {},
});

export default CategoriesContext;