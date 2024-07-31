import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() addUser = new EventEmitter();
  @Output() close = new EventEmitter();
  @Input() user: any;

  addUserData: FormGroup
  imgObj: File | null = null;
  imagePreview: string = '';



  constructor(private adminService: AdminService,private router:Router) {
    this.addUserData = new FormGroup({
      _name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      _email: new FormControl('', [Validators.required, Validators.email]),
      _profilePic: new FormControl(''),
      _password: new FormControl('',[Validators.required,Validators.minLength(8)]),
      _confirmPassword: new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }

  loadFile(event:any) {
    let target = event.target as HTMLInputElement;
    let files = target.files as FileList;

    if (files && files.length === 1) {
      const file = files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

      if (!validImageTypes.includes(file.type)) {
        this.addUserData.get('_profilePic')?.setErrors({ invalidType: true });
        target.value = '';
      } else {
        this.imgObj = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    } else {
      this.imgObj = null;
      this.imagePreview = '';
    }
  }

  async onSubmit() {
    if (!this.addUserData.valid || this.addUserData.get('_password')?.value !== this.addUserData.get('_confirmPassword')?.value) {
      this.addUserData.markAllAsTouched();
      return;
    }

    try {
      if (this.imgObj) {
        const base64Image = await this.convertToBase64(this.imgObj);
        this.addUserData.get('_profilePic')?.setValue(base64Image);
      }
      this.adminService.addUser(this.addUserData.value).subscribe((res) => {
        if (res) {
          window.location.reload();

        }
      })



    } catch (error:any) {
      alert(error.error.message);
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  closeModal() {
    this.close.emit()
  }

}
