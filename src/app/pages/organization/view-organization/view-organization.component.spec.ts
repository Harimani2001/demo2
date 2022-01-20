import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrganizationComponent } from './view-organization.component';

describe( 'ViewCompanyComponent', () => {
    let component: ViewOrganizationComponent;
    let fixture: ComponentFixture<ViewOrganizationComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule( {
            declarations: [ViewOrganizationComponent]
        } )
            .compileComponents();
    } ) );

    beforeEach(() => {
        fixture = TestBed.createComponent( ViewOrganizationComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
