import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {HttpProvider} from "../../providers/http/http";
import {User} from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

/**
 * @author: KMR
 * @email: yajuve.25.dz@gmail.com
 */

export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  /* Cette variable permet de pré-remplir le formulaire de login ou register */
  public account:User = {
    username: 'yajuve',
    fullname: 'Mohamed Raouf',
    email: 'amira.kerioui@gmail.com',
    password: 'mira',
    avatar:''
  };

  // Our translated text strings
  public loginErrorString: string; /* msg d'erreur lors de la connexion */
  private opt: string = 'signin'; /* opt = option, pour définir le tabs par défaut: inscription ou connexion  */

  constructor(public http:HttpProvider, public userProvider: UserProvider, public menuCtrl: MenuController, public navCtrl: NavController,
    public translateService: TranslateService) { /* translate service : pour définir différents langages*/
    this.menuCtrl.enable(false); /* ne pas afficher le menu */
  }

  // Attempt to login in through our User service
  doLogin_v1() { /* y aura une requête et quand le serveur aura les données, il les mettra dans la variable profile sinon il renvoie une erreur*/
    this.http.get('my-profile.json').subscribe((profile:User) => { /* faire une requête asynchrone (multi-thread) sur le fichier my-profile.json qui se situe dans asset mocks et le contenu du fichier est mis dans la variable profile */
      this.userProvider.user = <User>profile; /* but des getters et setters: avoir accès aux avriable private, ajout du profil user dans la class UserProvider grâce au setter. Suite à cela, nous pouvons récupérer le profil à tout moment puisqu'il est stocké dans la class UserProvider */
      if(this.checkedUser(profile))

        this.navCtrl.setRoot('ListFriendsPage'); /* set root pour refaire la pile de démarrage avec cette page. Permet de supprimer toutes les vues de la stack et de naviguer vers la root page. // navCtrl -> permet de naviguer sur plusieurs pages */
      else{
        this.account.email = "amira.kerioui@gmail.com";
        this.account.password = "mira"
        this.translateService.get('LOGIN_ERROR').subscribe((value) => { /* translateService permet d'effectuer du multi-langue */
        /* subscribe -> concept des PROMISE - OBSERVABLE, les traitement se fait de manière asynchrone */
        this.loginErrorString = value; /* affichage du msg d'erreur dans la page html via la variable loginErrorString */
    })
      }
    }, (err) => {
      console.error(err); /* en cas d'erreur sur la récup de l'utilisateur */
    });

  }

  doLogin(){
    this.userProvider.loginUser(this.account.email, this.account.password).then(
      isConnect => {
        if(isConnect){
          this.navCtrl.setRoot('ListFriendsPage'); // setRoot -> permet de supprimer toutes les vues de la stack et de navigateur vers la root page
        }else{
          this.loginErrorString = "Error connection"
        }
      }
    )
  }

  doRegister(){
    this.userProvider.registerUser(this.account).then(
      isConnect => {
        if(isConnect){
          this.navCtrl.setRoot('ListFriendsPage'); // setRoot -> permet de supprimer toutes les vues de la stack et de navigateur vers la root page
        }else{
          this.loginErrorString = "Error connection"
        }
      }
    )
  }

  checkedUser(users:User){
    return (users.email === this.account.email && users.password === this.account.password) ? true : false;
  } 
}
