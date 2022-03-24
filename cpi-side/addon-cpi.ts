import '@pepperi-addons/cpi-node'
import { Item, TransactionLine, UIObject } from '@pepperi-addons/cpi-node/build/cpi-side/app/entities';

var latestUIObject: UIObject;

export async function load() {
    console.log('loading cpi side ...');
    // debugger;
    subscribe();
    console.log('cpi side works!!!');
}

async function handleAlternativeData(data: UIObject, client) {

    let transactionLine = data.dataObject as TransactionLine;

    // let currentItemID = transactionLine.item.uuid;

    // let transaction = transactionLine.transaction;

    // debugger;
    
    let alternativeItemUUID = await transactionLine.item.getFieldValue('TSAAlternativeItems');
    if (alternativeItemUUID === null) {
        return null;
    }

    let alternativeItem = await pepperi.api.items.get({

        key: { UUID: alternativeItemUUID },

        fields: ["ExternalID", "Name", "Image"]

    });

    debugger;

    return alternativeItem;

}


function subscribe() {
    // // subscribe to run script event
    // // debugger;
    // pepperi.events.intercept("SetFieldValue" as any, {},
    //     async (data, next, main) => {
    //         // debugger;
    //         console.log(data);
    //         await next(main);
    //     });

    pepperi.events.intercept("SetFieldValue", {}, async (data, next, main) => {
        if (data.UIObject) {
            latestUIObject = data.UIObject;
        }
        if (data.client && latestUIObject) {
            // debugger;
            let alternativeItem = handleAlternativeData(latestUIObject, data.client);
            if (alternativeItem !== null) {
                console.log("my cpi-side works");
                const alternativeExternalID = (await alternativeItem)?.object.ExternalID;
                const alternativeName = (await alternativeItem)?.object.Name;
                const alternativeImage = (await alternativeItem)?.object.Image;
                const htmlMessage =
                    // '<!DOCTYPE html>\n<html>\n<head>\n<style>\n/* This style sets the width of all images to 100%: */\nimg {\n width: 100%;\n}\n</style>\n</head>\n<body>\n\n<img src="https://cdn3.vectorstock.com/i/thumb-large/18/02/are-you-ready-label-sticker-vector-20041802.jpg" style="width:256px;height:256px;">\n\n</body>\n</html>\n\n';
                    `<!DOCTYPE html>\n<html>\n<head>\n<style>\n/* This style sets the width of all images to 100%: */\nimg {\n width: 100%;\n}\n</style>\n</head>\n<body>\n\n<img src=${alternativeImage} style="width:256px;height:256px;"><p>item code: ${alternativeExternalID}<br>item name: ${alternativeName}</p>\n\n</body>\n</html>\n\n`;
                const actions = [
                    {
                        title: 'Add default item',
                        value: true,
                    },
                    {
                        title: 'Cancel',
                        value: false,
                    }
                ];
                const options = {
                    title: "Alternative Item Found!",
                    actions: actions,
                    content: htmlMessage,
                };
                try {
                    let res = await data.client.showDialog(options);
                    if (res) {
                        let transactionLine = latestUIObject.dataObject as TransactionLine;
                        let transaction = transactionLine.transaction;
                        // debugger;
                        const line = await pepperi.app.transactionScopeItems.update({
                            transaction: { UUID: transaction.uuid },
                            objects: [
                                {
                                    item: { ExternalID: alternativeExternalID },
                                    UnitsQuantity: data.FieldValue,
                                },
                                {
                                    item: { UUID: transactionLine.item.uuid },
                                    UnitsQuantity: 0,
                                }
                            ],
                            save: false
                        } as any);
                        // debugger;
                        console.log(line);
                    }
                } catch (error) { }
            }
            await next(main);
        }
    });
}
