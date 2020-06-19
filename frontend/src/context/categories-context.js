import React from 'react';

const CategoriesContext = React.createContext({
    categories: [],
    setCategories: function(){}
});

export default CategoriesContext;