import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{path: "", redirectTo: "/login",  pathMatch: "full"},
	{path: "login", component: AuthComponent},
	{path: "register", component: RegisterComponent},
	{path: "profile", component: ProfileComponent},
	{path: "transaction", component: TransactionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/*

*/
