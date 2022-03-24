import { Client, Request } from "@pepperi-addons/debug-server/dist";
import { AddonData, PapiClient } from "@pepperi-addons/papi-sdk";

export const ALT_ITEMS_TABLE = "AltItemsCondition";

export class AltItemsService{

	private papiClient : PapiClient
	

	constructor(private client : Client){
		this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
	}

    async upsert(request: Request) : Promise<AddonData>{
        const body = request.body;
        const addonData : AddonData = {
            Key: this.client.AddonUUID,
            FieldName: body.FieldName,
            FieldValue: body.FieldValue
        };

        return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(ALT_ITEMS_TABLE).upsert(addonData); 
    }

    async get(request : Request) : Promise<AddonData>{
        // const body = request.body;
        return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(ALT_ITEMS_TABLE).key(this.client.AddonUUID).get();
	}

    // getBlockKey(request : Request) :  string{
    //     const key : string = request?.query?.Key ?? request?.body?.Key;
    //     if(!key){
    //         throw new Error("Key not defined - the request: " + JSON.stringify(request));
    //     }
    //     else{
    //         return key;
    //     }
    // }
}