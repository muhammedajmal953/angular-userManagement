import { Component } from '@angular/core';
import { selectUser } from '../../states/user/user.selector';
import { select, Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private store: Store, private userservice: UserService) {
    this.editedData = new FormGroup({

      _name: new FormControl(''),
      _email: new FormControl(''),
      _profilePic: new FormControl(''),
    })
  }
  user$ = this.store.pipe(select(selectUser))

  isProfileEdited: boolean = true

  name: string = ''
  email: string = ''
  profilePic: string = ''

  editedData:FormGroup


  ngOnInit() {
    this.userservice.getUserData().subscribe((res) => {

      this.name = res.user.name
      this.email = res.user.email
      this.profilePic = res.user.profileImg
    })
  }


  openModal() {

    this.isProfileEdited = false
    this.editedData.patchValue({
      _name: this.name,
      _email: this.email,
      _profilePic: this.profilePic
    });

  }
  closeModal() {
    this.isProfileEdited = true
  }

}
