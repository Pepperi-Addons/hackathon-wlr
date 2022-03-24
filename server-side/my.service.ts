import { PapiClient, InstalledAddon, AddonDataScheme } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { ALT_ITEMS_TABLE } from './alt-items.service';

class MyService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.AddonUUID
        });
    }

    doSomething() {
        console.log("doesn't really do anything....");
    }
    
    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }

    async createFiltersSchema(){
        const tableScheme : AddonDataScheme = {
            Name: ALT_ITEMS_TABLE,
            Type: 'indexed_data',
            Fields: {
                FieldName: {
                    Type: 'String'
                },
                FieldValue: {
                    Type: 'Bool'
                },
            }
        }
        return this.papiClient.addons.data.schemes.post( tableScheme as any)
    }
}

export default MyService;