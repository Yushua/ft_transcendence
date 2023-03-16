import axios from 'axios';

export class AuthService {

      async check():Promise<void>{
        console.log("guard is working")
      }

      /**
       * 
       * @returns returns AccessToken
       */

      async OauthSystemCodeToAccess(data):Promise<string>{
        var accessToken:string;
        try {
            await axios.post(`https://api.intra.42.fr/oauth/token`, data).then((response) => {
              accessToken = response.data['access_token'];
            })        
        } catch (error) {
          //exemption
        }
        return accessToken
      }

      /**
       * 
       * @returns returns Intraname
       */
      async startRequest(accessToken: String):Promise<string>{
        var userID:string
        var intraName:string;
        try {
          const intraPull = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }).then((response) => {
            intraName = response['data'].login
          })
        } catch (error) {
          //exemption
        }

        console.log(`intraName == ${intraName}`)
        return intraName
      }
      async checkAccount(request: Request , response: Response, accessToken: string, intraName: string):Promise<void>{
        //if the account is created, but the status is still in creation, then either two people try to log in. so
          //need to write the email used, and auhtenticate
        //make an exemption saying these two things
        //go to error page application
        //if intraname does not exist... start the name
          //if email is empty, start the two factor autorization
          //if name for the first time, start name creation
        //if exist check if its logged in already
          //if not, then two factor autorization.
          //what if you're already logged in?
      }
}
