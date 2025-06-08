import axios from "axios";

export const addItem = async(item) => {
  console.log("Items Service",item);
  return await  axios.post('http://localhost:8080/admin/items', item, {headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}}); 
}


export const deleteItem = async(itemId) => {
    return await  axios.delete(`http://localhost:8080/admin/items/${itemId}` , {headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}});
  }


  
export const fetchItem = async() => {
    return await  axios.get('http://localhost:8080/items', {headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}});
  }