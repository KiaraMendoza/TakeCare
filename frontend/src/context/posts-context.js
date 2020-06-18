import React from 'react';

export default React.createContext({
    posts: [],
    isLoading: false,
    isEditing: false,
    isCreating: false,
    selectedPost: null,
    editingPost: null,
});