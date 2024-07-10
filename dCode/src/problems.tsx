import './App.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Problems() {
  const navigate = useNavigate();  

  const handleLogout = () => {
    navigate('/logout');
    window.location.reload();
    navigate('/');
  };

  return (
    <div className="App">
      <h1>Problems Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Problems;