import { Injectable } from "@angular/core";
//##### import theme datatype
import { TypeTheme } from "./data.model";
//##### imports angularFire for auth and @types/firebase
import { AngularFirestore } from "@angular/fire/firestore";
//##### observable for http response
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class SettingService {
  //##### variable to keep firebase themes
  firebaseThemes: any;

  //##### zarka default theme set
  zarkaTheme: TypeTheme = {
    navbar: "navbar navbar-dark blue-grey darken-1 navbar-expand-lg",
    sidebar: "left-skew-blue-gray blue-grey darken-1",
    button: "btn btn-outline-blue-grey waves-effect",
    tableTh: "blue-grey darken-1",
    loader: "#607d8b"
  };

  constructor(
    public db: AngularFirestore
  ) {}

  //##### set user theme //////////////////////////
  setZarkaTheme(theme: TypeTheme): void {
    // keep copy of the firebase theme id. (use this to modify a theme)
    const id = this.zarkaTheme.id;

    /* add email property to theme, 
     get value from storage else set value to default */
    theme.email = localStorage.getItem("zarkaUser")
      ? JSON.parse(localStorage.getItem("zarkaUser")).email
      : "guest-user@zarka";
 
    // update only if email isnt guest-user@zarka
    if (theme.email != "guest-user@zarka") {
      this.db.doc("themes/" + id).update(theme);
      this.zarkaTheme = { ...theme };
      this.zarkaTheme.id = id;
    }
  }

  //##### set user default theme on signup
  newUserTheme(email: string) {
    // add user email from signup form
    this.zarkaTheme.email = email;
    // add to themes collection firestore
    this.db.collection("themes").add(this.zarkaTheme);
  }

  //##### get all user themes from firebase
  getAllThemes() {
    this.db
      .collection("themes")
      .snapshotChanges()
      .subscribe(firebaseThemes => {
        this.firebaseThemes = firebaseThemes.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        });
        localStorage.setItem(
          "firebaseThemes",
          JSON.stringify(this.firebaseThemes)
        );
      });
  }
}
