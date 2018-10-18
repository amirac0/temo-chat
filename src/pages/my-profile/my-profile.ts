import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Util} from "../../providers/util/util";
import {User} from "../../models/user";
import {HttpProvider} from "../../providers/http/http";
import { UserProvider } from '../../providers/user/user';


/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})

/**
 * @author: KMR
 * @email: yajuve.25.dz@gmail.com
 */

export class MyProfilePage {

  public Util = Util;
  public oldEmail:string;
  private profile: User = new User();
  private isLoading: boolean = true;

  /* creation de variables */
  private string:string = "chaine de caractères";
  private intEtFloat:Number= 22.22;
  private boolean:boolean = true;
  private tableauInt:Array<Number> = [22, 11];
  private tout:any = {toto: "toto"};
  private tableauArray:any = [{toto: "toto"}];
  private instanceUser:User = new User();
  private tableauTout:Array<any> = [22, 11.2, true, 'etd', [5], this.instanceUser];



  constructor(
    public http:HttpProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userProvider: UserProvider
    ) {
  }

  ionViewDidLoad() {
    this.isLoading = false;
    this.profile = <User>this.userProvider.user;
    this.oldEmail = this.profile.email;
  }

  doSubmit() {
    if(this.oldEmail === this.profile.email){
      this.userProvider.updateUser(this.profile).then(
        data => this.navCtrl.setRoot("ListFriendsPage") // sio n modifie son profil on est renvoyé vers cette page
      )
    }else{
      this.userProvider.updateUser(this.profile, {type:true, email: this.oldEmail}).then(
        data => this.navCtrl.setRoot("ListFriendsPage")
      )
    }
  }

}
