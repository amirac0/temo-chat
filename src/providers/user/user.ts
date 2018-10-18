import {Injectable} from '@angular/core';
import {User} from "../../models/user";
import { Storage } from '@ionic/storage';


/*
 Generated class for the UserProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class UserProvider {

  private _user:User = new User();
  private _status:Number = 0; // le but de cette variable c'est de savori si l'utilisateur existe ou pas

  constructor(private nativeStorage: Storage) {
    console.log('Hello UserProvider Provider');
    // quand le user n'existe pas 
    this.statusUsers().then(
      data => this._status = data
    )
  }


  get user():User {
    return this._user;
  }

  set user(value:User) {
    this._user = value;
  }

  statusUsers(){
    // si tu n'arrives pas à récupérer la données tu refais statusUsers()
    return this.nativeStorage.get('users').then( // tentative de récupération de la data stockée via la key 'users'
      data => { // Récupération réussie - le plugin a pu se connecter au stockage local
        if(data === null){ // on vérifie si la data 'users' existe
          this.nativeStorage.set('users', []); // si elle n'existe pas on la crée
          return 0;
        }else{ // si elle existe
          if(Array.isArray(data)){ // on vérifie si c'est un tableau
            return(data.length > 0)? 1: -1;
          }else{ // on vérifie si ce n'est pas un tableau
            this.nativeStorage.set('users', []);
            return 0;
          }
        }
      },
      error => { // la tentative de récupération échoue - on crée la data eton recommence 
        this.nativeStorage.set('users', []);
        //this.statusUsers();
        return 0;
        //console.error(error)
      }
    );
  }

  checkedEmail(email:string){
    return this.nativeStorage.get('users').then(
      users => { // on parcours le tableau des éléments stockés dans la key users
        if(users !== null)
          for(let i=0; i < users.length; i++){
            if(users[i].email === email) // on vérifie si l'email = l'email entré en paramètre
              return true;
          }
          return false;
      }
    )
  }

  registerUser(user:User){ //user doit suivre le modèle User( mail, password, avatar, ...)
    return this.statusUsers().then(
      theStatus =>{
        switch(this._status){
          case 1: // si les données récupérées ne sont pas vides, 
          return this.nativeStorage.get('users').then( // pour ne pas avoir 2 emails pareils
            users => {
              let isValided: boolean = false; // init variable, l'objectif est de vérifier si email est déjà dans l'array. Par défaut on dit qu'il n'y est pas 
              for(let i = 0; i < users.length; i++)
                if(users[i].email === user.email) // on vérifie si l'email existe
                  isValided = true; // on enregistre dans la variable le fait que l'email a été trouvé dans le tableau d'utilisateur
                if(isValided)
                  return false;
                this._user = user;
                users.push(user); // Ajouter le nouvel utilisateur dans le tableau  (push pour ajouter dans le tableau pop c'est pour enlever)
                return true;
            }
          );
          //default:
            //return false;
    
          case 0:
          case -1:
            return this.nativeStorage.set('users', [user]).then(
              data => {return true;}
            ); // users c'est la key, user c'est la donnée
          default:
          return this.nativeStorage.set('users', [user]).then(
            data => {return true;}
          );
        }
      }
    )
    

  }

  loginUser(email:string, password:string){
    return this.checkedEmail(email).then( // on vérifie si l'adresse mail est enregistrée
      data => {
        if(data){ // vérification du résultat de la promesse 'checkedEmail'
          return this.nativeStorage.get('users').then( // on récupère des utilisateurs 
            users => {
              for(let i = 0; i < users.length; i++)
                if(users[i].email === email && users[i].password === password){
                  this._user = users[i]; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
                  return true;
                } // on vérifie le password
              return false;
            }
          )
        }
        return false;
      }
    )
  }

  updateUser(user:User, isEmail:any = {type: false}){
    return this.nativeStorage.get('users').then( // on récupère des utilisateurs 
      users => {
        for(let i = 0; i < users.length; i++){
          if(users[i].email === user.email){
            this._user = users; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
            users[i] = user;
            this.nativeStorage.set('users', users)
            return true;
          }
          if(isEmail){
            if(users[i].email === isEmail.email){
              this._user = users; // Ajout du profile user dans la class UserProvider grace au setter. Grace a sa, nous pouvont recuperer le profile à tout moments vu qu'il est stocker dans la class UserProvider
              users[i] = user;
              this.nativeStorage.set('users', users)
              return true;
            }
          }
        }
        return false;
      }
    )
  }

}
