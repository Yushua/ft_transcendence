import {  removeCookie } from 'typescript-cookie';
import { newWindow } from '../App';
import LoginPage from '../Login/LoginPage';
import ChatRoom from '../Utils/Cache/ChatRoom';
import ChatUser from '../Utils/Cache/ChatUser';
import User from '../Utils/Cache/User';

function LogoutButtonComponent() {
  removeCookie('accessToken');
  User.Clear();
  ChatUser.Clear();
  ChatRoom.Clear();
  localStorage.removeItem('authToken');
  newWindow(<LoginPage/>);
    return (
      <div>
      </div>
    )
}

export default LogoutButtonComponent;
