import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
  const { setAuth } = useAuth();
  const location = useLocation;
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        { user, pass: pwd },
        {
          withCredentials: true,
        }
      );
      //console.log(response?.data);
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrMsg('No server response');
      } else if (err.response?.data?.message) {
        setErrMsg(err.response.data.message);
        console.log(err.response.data.message);
      } else {
        setErrMsg('Login failed!');
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          ref={userRef}
          autoComplete='off'
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          ref={userRef}
          autoComplete='off'
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        <button>Sign In</button>
      </form>
      <p>
        Need an account?
        <br />
        <span className='line'>
          <Link to='/register'>Sign Up!</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
