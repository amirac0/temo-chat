import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Friend } from '../../models/user';

/*
  Generated class for the UserApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserApiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UserApiProvider Provider');
  }

  // On va créer le CRUD mais côté client
  getAllUsers():Observable<any>{ // On charge tous les utilisateurs
    return new Observable(observer => { // ça c'ets notre observable, tant que la variable n'a pas fait next il fait la requête en Ajax en promesse
      this.http.get("http://localhost:8080/user").toPromise().then( //promesse qui va faire un traitement et donner une réponse, le then c'est en cas de succès et le catch en cas d'erreur 
        (reponse:any) => { // Envoi d'une rquête asynchrone (comme ajax) et traitement en promise
          console.log(reponse)
          let newFriends:Friend[] = new Array(); //création d'un tableau Friend
          if(reponse.httpCode === 200){// si le serveur nous a bien répondu, un code 200 (tt va bien)
            for(let i = 0; i < reponse.users.length; i++){ //parcourir le tableau d'utilisateurs pour les convertir en Friend
              var friend = new Friend(); // création d'une nouvelle entité Friend vide
              friend.username = reponse.users[i].email.split("@")[0]; // On coupe l'adrese mail pour récuérer le début et on le définit comme username
              friend.fullname = reponse.users[i].firstName + ' ' + reponse.users[i].lastname; // pour avoir le fullname, on concatène
              friend.avatar = reponse.users[i].avatar;
              friend.email = reponse.users[i].email;
              friend.createdAt = reponse.users[i].createdAt;
              friend.updatedAt = reponse.users[i].updatedAt;
              
              newFriends.push(friend); //on ajoute le new Friend dans le tableau Friend
            }
            observer.next(newFriends); // On retourne les données traitées dans l'observable
          }
        }).catch(err => {
            console.log(err)
        })
    })
  }
}
