import { authGuard } from './core/guards/auth/auth.guard';
import { loggedGuard } from './core/guards/logged/logged.guard';
import { AuthComponent } from './layouts/auth/auth.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { Routes } from '@angular/router';
import { NotfoundComponent } from './pages/notfound/notfound.component';


export const routes: Routes = [
    {path: '' , redirectTo: 'home' , pathMatch: 'full'},
    {path: '', component: AuthComponent, canActivate:[loggedGuard] , title:'auth !' , children : [
        {path: 'register' , loadComponent: ()=>import('./pages/register/register.component').then( (c)=>c.RegisterComponent ) , title: 'Register'},
        {path: 'login' , loadComponent: ()=>import('./pages/login/login.component').then( (c)=>c.LoginComponent ) , title: 'Login'},
        {path: 'forgot' , loadComponent: ()=>import('./shared/components/ui/forgot/forgot.component'). then( (c)=>c.ForgotComponent ) , title: 'Forgot !'},
    ]},
    {path: '', component: BlankComponent, canActivate:[authGuard] ,title:'blank !', children : [
        {path: 'home', loadComponent: ()=>import('./pages/home/home.component').then( (c)=>c.HomeComponent ) , title : 'Home!'},
        {path: 'categories' , loadComponent: ()=>import('./pages/categories/categories.component').then( (c)=>c.CategoriesComponent ) , title : 'Ctegories!'},
        {path: 'products' , loadComponent: ()=>import('./pages/products/products.component').then( (c)=>c.ProductsComponent ) , title : 'Products!'},
        {path: 'cart' , loadComponent: ()=>import('./pages/cart/cart.component').then( (c)=> c.CartComponent ) , title : 'Cart!'},
        {path: 'brands' , loadComponent: ()=>import('./pages/brands/brands.component').then( (c)=>c.BrandsComponent ) , title : 'Brands'},
        {path: 'product-details/:id' , loadComponent: ()=>import('./pages/product-details/product-details.component').then( (c)=>c.ProductDetailsComponent ) , title : 'Product Details'},
        {path: 'checkout/:id' , loadComponent: ()=>import('./pages/checkout/checkout.component').then( (c)=>c.CheckoutComponent ) , title: 'Ceckout!'},
        {path: 'allorders' , loadComponent: ()=>import('./pages/allorders/allorders.component').then( (c)=>c.AllordersComponent ) , title: 'Alloeders!'},
        {path: 'wishlist' , loadComponent: ()=>import('./pages/wishlist/wishlist.component').then( (c)=>c.WishlistComponent ), title: 'Wishlist !'},
        {path: 'search-products/:id' , loadComponent: ()=>import('./pages/search-products/search-products.component').then( (c)=>c.SearchProductsComponent ), title: 'Search Product !'},
        // {path : '**' , loadComponent: ()=>import('./pages/notfound/notfound.component').then( (c)=>c.NotfoundComponent ) , title: 'Notfound !'}
        {path: '**' , component:NotfoundComponent , title: 'Notfound !'}
    ]}
    
    
];
