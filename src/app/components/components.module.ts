import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgUserComponent } from './img-user/img-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampoComponent } from './campo/campo.component';



@NgModule({
  declarations: [
    ImgUserComponent,
    CampoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    ImgUserComponent
  ]
})
export class ComponentsModule { }
