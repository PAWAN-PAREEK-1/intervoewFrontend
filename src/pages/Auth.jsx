import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import classes from './Auth.module.scss';

function Auth() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <Layout>
      <div className={classes.form_container}>
        {isLogin ? <Login /> : <Register />}
        <button
          className={classes.toggleButton}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </Layout>
  );
}

export default Auth;
