import { deleteUser } from "../../Service/UserService";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from 'axios';



const UsersList = ({users,setUsers}) => {

     const [searchTerm, setSearchTerm] = useState('');
    
     const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const  deleteByUserId = async (userId) => {
            try {
             await deleteUser(userId);
              setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                  toast.success("User Deleted");
          }catch(error){ 
            console.error(error);
            toast.error("Unable to Delete Category");
          }
        }  
 
    return(
        <div className = "category-list-container" style={{height:'100vh',overflowY:'auto',overflowX:'hidden' }}>
        <div className="row pe-2">
          <div className="input-group mb-3">
              <input type="text"
               name="keyword" 
               id="keyword"
               placeholder="Search by Keyword" 
               className="form-control"
               onChange={(e)=> setSearchTerm(e.target.value)}
               value={searchTerm}
               />
               <span className="input-group-text bg-warning">
                  <i className="bi bi-search"></i>
               </span>
          </div>
        </div>
      <div className="row g-3 pe-2">   
       

      {filteredUsers.map((user,index)=> (
              <div key={index} className="col-12">
                  <div className="card p-3 bg-dark">
                     <div className="d-flex justify-content-between align-items-center"> 
                       <div className="flex-grow-1">
                        <h5 className="mb-1 text-white">{user.name}</h5>
                        <p className="mb-0 text-white">{user.email}</p>
                    </div>
                    <div>
                        <button className='btn btn-danger btn-sm ms-2 ' 
                        onClick={()=> deleteByUserId(user.userId) }
                        title="Deleted user">
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
         ))}                
                
  </div>           
</div>
    )
}


export default UsersList;