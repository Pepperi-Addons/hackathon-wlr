import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { AltItemsService } from './alt-items.service'

// add functions here
// this function will run on the 'api/foo' endpoint
// the real function is runnning on another typescript file
// export async function foo(client: Client, request: Request) {
//     const service = new MyService(client)
//     const res = await service.getAddons()
//     return res
// };

export async function alt_items_conditions(client: Client, request: Request) {
    const service = new AltItemsService(client)
    switch (request.method) {
        case 'POST':
            return service.upsert(request);
        case 'GET':
            return service.get(request);
        default:
            throw new Error(`Method '${request.method}' is not supported`);
    }
};

