import './NotFound.css';
import { useNavigate } from 'react-router-dom';



export const NotFound = () => {


   const navigate = useNavigate();
          
  return (


    <div className="not-found-container">

            <div className="not-found-content">
                <h1 className="not-found-title">
                    404 - Page Not Found
                </h1>

                <h2 className='not-found-subtitle'>
                    The page you are looking for does not exist.    
                </h2>

                <p className='not-found-message'>
                   the page you are looking  might have been removed, or did not exist.
                    </p>
                  <button className="not-found-button"  onClick={() => navigate("/")} >
                    Go to Homepage    
                  </button>

            </div>
          </div>
  )
          

}               

export default NotFound;    
