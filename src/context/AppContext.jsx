import { createContext, useEffect, useState } from 'react';
import { fetchCategory } from '../Service/CategoryService';
import { fetchItem } from '../Service/ItemService';
import axios from 'axios';


export const AppContext = createContext(null);


export const AppContextProvider = (props) => {

  const [categories, setCategories] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [auth, setAuth] = useState({ token: null, role: null });
  const [cartItems, setCartItems] = useState([]);


  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }

  }

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.itemId !== itemId));


  }

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item => item.itemId === itemId ? { ...item, quantity: newQuantity } : item));

  }


  useEffect(() => {

    if (localStorage.getItem("token") && localStorage.getItem("role")) {
      setAuth(
        localStorage.getItem("token"),
        localStorage.getItem("role")
      );
    }
    async function loadData() {
      const response = await fetchCategory();
      const itemsResponse = await fetchItem();

      setCategories(response.data);
      setItemsData(itemsResponse.data);
    }
    loadData();
  }, []);

  

  const setAuthData = (token, role) => {
    setAuth({ token, role });
  }


  const clearCart = () => {
    setCartItems([]);
  }
  const contextValue = {
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
    addToCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart

  }

  return <AppContext.Provider value={contextValue}>
    {props.children}
  </AppContext.Provider>
}