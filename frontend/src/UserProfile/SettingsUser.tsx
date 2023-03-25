import '../App.css';
import HTTP from '../Utils/HTTP';
import ProfilePicture from './ProfilePicture';

export async function asyncChangeName(newUsername:string) {
  HTTP.Post(`user-profile/userchange/${newUsername}`, null, {Accept: 'application/json'})
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  newInput: HTMLInputElement
}

export interface YourFormElement extends HTMLFormElement {
  readonly elements: FormElements
 }

async function handleUsernameChange(e: React.FormEvent<YourFormElement>){
  e.preventDefault();
  await asyncChangeName(e.currentTarget.elements.username.value);
}


function SettingsUser(){

  return (
    <div className="SettingsUser">
      <form onSubmit={handleUsernameChange}>
        <div>
          <label htmlFor="username">new username Input:</label>
          <input id="username" type="text" />
          <button type="submit">Submit</button>
        </div>
      </form>
      <ProfilePicture/>
    </div>
  );
}

export default SettingsUser;
