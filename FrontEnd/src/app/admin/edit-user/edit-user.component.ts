import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
 _id: string = '';
  editedData: FormGroup
  imgObj: File|null=null;
  imagePreview: string = '';
  @Input() user: any
  @Output() close = new EventEmitter();

  constructor(private adminService: AdminService) {

      this.editedData = new FormGroup({

        _name: new FormControl('',[Validators.required,Validators.minLength(5)]),
        _email: new FormControl('',[Validators.required,Validators.email]),
        _profilePic: new FormControl(''),
        _oldPassword: new FormControl(''),
        _newPassword:new FormControl('')
      })

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.populateForm();
    }
  }

  populateForm(): void {
    if (this.user) {
      this.editedData.patchValue({
        _name: this.user.name || '',
        _email: this.user.email || '',
        _profilePic: this.user.profilePic || '',
        _oldPassword:  '',
        _newPassword: ''
      });
      this._id = this.user._id;
    }
  }
  onSubmit() {
    if (!this.editedData.valid) {
      this.editedData.markAllAsTouched();
      return;
    }

    if (this.imgObj) {
      this.convertToBase64(this.imgObj).then((base64Image) => {
        this.editedData.get('_profilePic')?.setValue(base64Image);
      });
    }

    this.adminService
      .editUser(this.editedData.value,this._id)
      .subscribe((res) => {
        this.close.emit(res);
      }, (error) => {
        alert(error.error.message);
      }
      );


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
      this.imgObj = null
      this.imagePreview=''
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

  closeModal() {
    this.close.emit();
  }

}
