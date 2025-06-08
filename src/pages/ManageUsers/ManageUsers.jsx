import { useEffect, useState } from 'react';
import UserForm from '../../components/UserForm/UserForm';
import UsersList from '../../components/UsersList/UsersList';
import './ManageUsers.css';
import { fetchUser } from '../../Service/UserService';
import axios from 'axios';
import toast from 'react-hot-toast';



const ManageUsers = () => {

    const[users,setUsers] = useState([]);
    const[loading,setLoading]=useState(false);
     

    useEffect(() => {
      async function loadUsers(){

        try{
        const response = await fetchUser();
        setUsers(response.data);

        }catch(error){
            console.error(error);
            toast.error("unable to fetch user");
        }finally{
          setLoading(false);
        }
      }
      loadUsers();
      
    },[]); 
    return (
        <div className="users-container text-light">
            <div className="left-column">
              <UserForm setUsers={setUsers} /> 
            </div>

            <div className="right-column">
                <UsersList users={users}  setUsers={setUsers}  />
                </div>
        </div>
    )
}


export default ManageUsers; 