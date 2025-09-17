export const initialStore = () => ({
  message: null,
  todos: [
    {
      id: 1,
      title: "Make the bed",
      background: null,
    },
    {
      id: 2,
      title: "Do my homework",
      background: null,
    }
  ],
  favorites: []  
});

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    
    case 'add_favorite':
      
      const existingFavorite = store.favorites.find(
        fav => fav.uid === action.payload.uid && fav.type === action.payload.type
      );
      if (existingFavorite) {
        return store; 
      }
      return {
        ...store,
        favorites: [...store.favorites, action.payload]
      };
    
    case 'remove_favorite':
      return {
        ...store,
        favorites: store.favorites.filter(
          fav => !(fav.uid === action.payload.uid && fav.type === action.payload.type)
        )
      };
    
    default:
      throw Error('Unknown action.');
  }
}