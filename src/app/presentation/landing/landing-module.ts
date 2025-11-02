import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing-module';
import { LandingPage } from './landing-page/landing-page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    LandingPage
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule 
  ]
})
export class LandingModule { }