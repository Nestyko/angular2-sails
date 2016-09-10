import { NgZone } from "@angular/core";
import { Observable } from "rxjs/Rx";
export declare class SailsService {
    private zone;
    private _io;
    private _connected;
    private _opts;
    private _restPrefix;
    private _serverUrl;
    private _pubsubSubscriptions;
    constructor(zone: NgZone);
    restPrefix: string;
    serverUrl: string;
    connect(url: any, opts?: any): void;
    request(options: any): Observable<any>;
    get(url: any, data?: any): Observable<any>;
    post(url: any, data?: any): Observable<any>;
    put(url: any, data?: any): Observable<any>;
    delete(url: any, data?: any): Observable<any>;
    on(eventIdentity: string): Observable<any>;
}
