import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, authData } from '../../redux/slices/auth';
import { logout } from '../../redux/slices/auth';
import { Avatar } from '@mui/material';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const authUser = useSelector(authData);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };


  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Wavejke Blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <div className={styles.avatar}>
                <span>{authUser.fullName}</span>
                <Avatar alt={authUser.fullName} src={authUser.avatarUrl} />
                </div>
                <Link to="/add-post">
                  <Button variant="contained">Create Post</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
