import { Component } from '@angular/core';
import { selectUser } from '../../states/user/user.selector';
import { select, Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getUserdata } from '../../states/user/user.actions';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user$ = this.store.pipe(select(selectUser))

  constructor(private store: Store, private userservice: UserService) {
    this.editedData = new FormGroup({

      _name: new FormControl('',[Validators.required,Validators.minLength(5)]),
      _email: new FormControl('',[Validators.required,Validators.email]),
      _profilePic: new FormControl(''),
      _oldPassword: new FormControl('',[Validators.minLength(8)]),
      _newPassword:new FormControl('',[Validators.minLength(8)])
    })
    this.store.dispatch(getUserdata());
    this.user$.subscribe((res) => {
      if (res) {
        this.name = res.name
        this.email = res.email
        this.profilePic = res.profileImg
       }
    })
  }


  private imgObj: File | string=''
  imagePreview:string=''
  isProfileEdited: boolean = true

  name: string = ''
  email: string = ''
  profilePic: string = ''

  editedData:FormGroup

  async onSubmit() {
    if (!this.editedData.valid) {
      this.editedData.markAllAsTouched();
      return;
    }

    if (this.imgObj) {
      try {
        const base64Image = await this.convertToBase64(this.imgObj as File);
        this.editedData.get('_profilePic')?.setValue(base64Image);
      } catch (error) {

        console.error('Error reading file:', error);
        return;
      }
    }

    if (!this.isProfileEdited) {
      this.userservice.updateUser(this.editedData.value).subscribe(
        (res) => {
          if (res.message === 'user updated successfully') {
            this.store.dispatch(getUserdata());
            this.isProfileEdited = true;
          }
        },
        (error) => {
          alert(error.error.message);
        }
      );
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });
  }


  loadfile(event:any) {
    let target = event.target as HTMLInputElement;
    let files = target.files as FileList;

    if (files && files.length === 1) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      const validExtensions = new Set(imageExtensions)
      const exec = files[0].name.substring(files[0].name.lastIndexOf('.'))

      if (!validExtensions.has(exec)) {
        this.editedData.get('_profilePic')?.setErrors({ invalidExtension: true })
        target.value=''
      } else {
        const file = files[0]
        this.imgObj = file
        this.imagePreview=URL.createObjectURL(file)
      }
    } else {
      this.imgObj = ''
      this.imagePreview=''
    }
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
