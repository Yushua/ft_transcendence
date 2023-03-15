import React, { } from 'react';
import '../App.css';

import { newWindow } from '../App';
import MainWindow from '../MainWindow/MainWindow';
import User from '../Utils/Cache/User';
import HTTP from '../Utils/HTTP';

interface FormElements extends HTMLFormControlsCollection {
  intraname: HTMLInputElement
  password: HTMLInputElement
}

interface YourFormElement extends HTMLFormElement {
 readonly elements: FormElements
}

const handleAccCreation = (e: any) => {
  e.preventDefault();
    //if email is empty, start the two factor autorization
    //if name for the first time, start name creation
}

function ErrorpageApplication(){
  return (

    <div className="LoginpageV2">
       <span className="heading">
          </span>
          <form onSubmit={(handleAccCreation)}>
          <button type="submit">Login</button>
          </form>
    </div>
  );
}

export default ErrorpageApplication;
