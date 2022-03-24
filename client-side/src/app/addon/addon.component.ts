import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { AddonService } from "./addon.service";

type SelectOptions = Array<{
    key: string;
    value: any;
}>;

@Component({
    selector: 'addon-module',
    templateUrl: './addon.component.html',
    styleUrls: ['./addon.component.scss']
})
export class AddonComponent implements OnInit {
    @Input() hostObject: any;
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    fieldOptions: SelectOptions = [
		{key: "String", value: "String"},
		{key: "Filter", value: "Filter"}
	];

    valueOptions: SelectOptions = [
        {key: 'true', value: true},
        {key: 'false', value: false}
    ]
    screenSize: PepScreenSizeType;

    selectedField: string;
    selectedValue: string;


    constructor(
        public addonService: AddonService,
        public layoutService: PepLayoutService,
        public translate: TranslateService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });
        this.getItemFields();
    }

    async getItemFields(){
        this.fieldOptions = [
                            {key: 'TSAIsNotRecommended', value: 'TSAIsNotRecommended'},
                            {key: 'TSAHasAltItem', value: 'TSAHasAltItem'}
                        ];
    }

    ngOnInit() {
    }

    openDialog() {
        
    }

    onFieldChange(itemField : string){
        this.selectedField = itemField;
    }

    onValueChange(selectedValue : string){
        this.selectedValue = selectedValue;
    }
}
