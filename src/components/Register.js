import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9_-]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    //console.log(result);
    //console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    //console.log(result);
    //console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pass: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));

      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser('');
      setPwd('');
      setMatchPwd('');
      navigate('/');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username taken');
      } else {
        setErrMsg('Registeration failed');
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>
          Username:
          <FontAwesomeIcon
            icon={faCheck}
            className={validName ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={!user || validName ? 'hide' : 'invalid'}
          />
        </label>
        <input
          ref={userRef}
          id='username'
          type='text'
          autoComplete='off'
          value={user}
          required
          onChange={(e) => setUser(e.target.value)}
          aria-invalid={validName ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        <p
          id='uidnote'
          className={
            userFocus && user && !validName ? 'instructions' : 'offscreen'
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters. <br />
          Must begin with a letter
          <br />
          Letters, numbers, underscores, hypens allowed
        </p>

        <label htmlFor='password'>
          Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPwd || !pwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          type='password'
          id='password'
          value={pwd}
          autoComplete='off'
          required
          onChange={(e) => setPwd(e.target.value)}
          aria-invalid={validPwd ? 'false' : 'true'}
          aria-describedby='pwdnote'
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id='pwdnote'
          className={!validPwd && pwdFocus ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:
          <span aria-label='exclamation mark'>!</span>
          <span aria-label='at symbol'>@</span>
          <span aria-label='hashtag'>#</span>
          <span aria-label='dollar sign'>$</span>
          <span aria-label='percent'>%</span>
        </p>

        <label htmlFor='confirm_pwd'>
          Confirm Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validMatch && matchPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validMatch || !matchPwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          type='password'
          id='confirm_pwd'
          value={matchPwd}
          required
          autoComplete='off'
          onChange={(e) => setMatchPwd(e.target.value)}
          aria-invalid={validMatch ? 'false' : 'true'}
          aria-describedby='confirmnote'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p
          id='confirmnote'
          className={!validMatch && matchFocus ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field
        </p>

        <button disabled={validName && validPwd && validMatch ? false : true}>
          Sign Up!
        </button>
      </form>
      <p>
        Already registered?
        <br />
        <span className='line'>
          {/* put router link here */}
          <Link to='/'>Sign In</Link>
        </span>
      </p>
    </section>
  );
};

export default Register;
