import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // if logout button is used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    navigate('/linkpage');
  };

  return (
    <section>
      <h1>Home</h1>
      <br />
      <p>You are logged in!</p>
      <br />
      <Link to='/editor'>Go to Editor page</Link>
      <br />
      <Link to='/admin'>Go to Admin page</Link>
      <br />
      <Link to='/lounge'>Go to Lounge page</Link>
      <br />
      <Link to='/linkpage'>Go to link page</Link>
      <div className='flexGrow'>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    </section>
  );
};

export default Home;
