import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ListService } from '../../_services/index';
import { Inject } from '@angular/core';
import { FileComponent } from '../files/files.component';
import { MyFileOfList } from '../../_models/index';
import { DownloadService } from "../../_services/download.service";
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { GlobalDataService } from '../../_services/global-data.service';

@Component({
  moduleId: module.id,
  selector: 'pdf-app',
  templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    providers: [ FileComponent ]
})

export class PreviewComponent implements OnChanges {

    @Input() closable = true;
    @Input() visible: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() path: MyFileOfList;

    // for shared files
    @Input() isSharedFile: boolean = false;
    @Input() owner : String = '';

    errorMessage : String = "";

    pdfSrc: string = '';
    error: any;
    page: number = 1;
    rotation: number = 0;
    zoom: number = 0.5;
    originalSize: boolean = false;
    pdf: any;
    renderText: boolean = true;
    progressData: PDFProgressData;
    isLoaded: boolean = true;
    stickToPage = false;
    showAll = false;

    constructor(private downloadService: DownloadService, private gd: GlobalDataService) {
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...

        if (this.path != undefined) {
            //alert(this.path);
            if(this.isSharedFile){
                //option for download shared files
                this.test();
            }else {

                //default option
                this.onFileSelected();

            }
        }
    }


    test() {
        // console.log("test");
        let user_id: string = localStorage.getItem('currentUser');

        // Load pdf
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.gd.base_ip + '/files/downloadSharedFile/', true);
        xhr.setRequestHeader("AUTHTOKEN", localStorage.getItem('authtoken'));
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        //var params="filename='response.pdf'&user_id=jucjimenezmo@unal.edu.co";
        //alert("filename='" + this.path.name + "'&user_id=" + user_id);

        //var params='filename=\'' + this.path.name + '\'&user_id=' + this.owner;

        var params="filename="+ this.path.name + "&user_id=" + this.owner;
        console.log('-'+ params + '-')


        xhr.responseType = 'blob';
        xhr.onload = (e: any) => {
            console.log(xhr);
            if (xhr.status === 200) {
                let blob = new Blob([xhr.response], {type: 'application/pdf'});
                this.pdfSrc = URL.createObjectURL(blob);
                console.log(this.pdfSrc);

                if (typeof (FileReader) !== 'undefined') {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.pdfSrc = e.target.result;
                    };
                    reader.readAsArrayBuffer(blob);
                }

            }
        };
        xhr.send(params);

    }
    /**
     * Render PDF preview on selecting file
     */
    onFileSelected() {

        // Load pdf
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this.gd.base_ip + '/files/downloadFile/' + this.path.name, true);
        xhr.setRequestHeader("AUTHTOKEN", localStorage.getItem('authtoken'));
        xhr.responseType = 'blob';
        xhr.onload = (e: any) => {
            console.log(xhr);
            if (xhr.status === 200) {
                let blob = new Blob([xhr.response], { type: 'application/pdf' });
                this.pdfSrc = URL.createObjectURL(blob);
                console.log(this.pdfSrc);

                if (typeof (FileReader) !== 'undefined') {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.pdfSrc = e.target.result;
                    };
                    reader.readAsArrayBuffer(blob);
                }

            }
        };
        xhr.send();
    }

    // @jucjimenezmo
    onShareFileSelected() {

        console.log('Inicio onShareFileSelected ');

        var formData: FormData = new FormData();
        // Load pdf
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.gd.base_ip + '/files/downloadSharedFile', true);
        xhr.setRequestHeader("AUTHTOKEN", localStorage.getItem('authtoken'));
        //xhr.setRequestHeader('Content-Type', 'application/json');

        //build body of request
        let user_id : string = localStorage.getItem('currentUser');
        let body: any =
            {
                "user_id": user_id,
                "filename": this.path.name
            };

        xhr.responseType = 'blob';
        xhr.onload = (e: any) => {
            console.log(xhr);
            if (xhr.status === 200) {
                let blob = new Blob([xhr.response], { type: 'application/pdf' });
                this.pdfSrc = URL.createObjectURL(blob);
                console.log(this.pdfSrc);

                if (typeof (FileReader) !== 'undefined') {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.pdfSrc = e.target.result;
                    };
                    reader.readAsArrayBuffer(blob);
                }

            }
        };
        xhr.send(body);
    }

    incrementPage(amount: number) {
        this.page += amount;
    }

    incrementZoom(amount: number) {
        this.zoom += amount;
    }

    rotate(angle: number) {
        this.rotation += angle;
    }

    /**
     * Get pdf information after it's loaded
     * @param pdf
     */
    afterLoadComplete(pdf: PDFDocumentProxy) {
        this.pdf = pdf;
        this.isLoaded = true;
    }

    /**
     * Handle error callback
     *
     * @param error
     */
    onError(error: any) {
        this.error = error; // set error
    }

    /**
     * Pdf loading progress callback
     * @param {PDFProgressData} progressData
     */
    onProgress(progressData: PDFProgressData) {
        this.progressData = progressData;
        this.isLoaded = false;
        this.error = null; // clear error
    }

    getInt(value: number): number {
        return Math.round(value);
    }


}











