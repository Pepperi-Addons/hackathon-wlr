import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jwt-decode';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { Injectable } from '@angular/core';

import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';

export interface UIType {
    ID: number;
    Name: string;
}


export interface ItemFieldMetaData {
    InternalID: number;
    FieldID: string;
    Label: string;
    Description: string;
    IsUserDefinedField: boolean;
    UIType: UIType;
    Type: string;
    Format: string;
    CreationDateTime: Date;
    ModificationDateTime: Date;
    Hidden: boolean;
    CSVMappedColumnName?: any;
    UserDefinedTableSource?: any;
    CalculatedRuleEngine?: any;
}

@Injectable({ providedIn: 'root' })
export class AddonService {

    accessToken = '';
    parsedToken: any
    papiBaseURL = ''
    addonUUID;

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: this.addonUUID,
            suppressLogging:true
        })
    }

    private _itemMetaData = new BehaviorSubject<Array<ItemFieldMetaData>>([]);
    public itemMetaData$ = this._itemMetaData.asObservable();
    
    constructor(
        public session:  PepSessionService,
        private pepHttp: PepHttpService
    ) {
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];
    }

    async get(endpoint: string): Promise<any> {
        return await this.papiClient.get(endpoint);
    }

    async post(endpoint: string, body: any): Promise<any> {
        return await this.papiClient.post(endpoint, body);
    }

    pepGet(endpoint: string): Observable<any> {
        return this.pepHttp.getPapiApiCall(endpoint);
    }

    pepPost(endpoint: string, body: any): Observable<any> {
        return this.pepHttp.postPapiApiCall(endpoint, body);

    }

    async getItemFields(){
        return this.get("meta_data/items/fields");//.then((fieldMetaData) => this._itemMetaData.next(fieldMetaData))
    }

}
