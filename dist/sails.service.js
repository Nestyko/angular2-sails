"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
if (io && io.sails) {
    if (io && io.socket && io.socket.isConnected()) {
        io.socket.disconnect();
    }
}
var SailsService = (function () {
    function SailsService(zone) {
        this.zone = zone;
        this._connected = false;
        this._restPrefix = "";
        this._pubsubSubscriptions = {};
        this._opts = {
            url: null
        };
    }
    Object.defineProperty(SailsService.prototype, "restPrefix", {
        get: function () {
            return this._restPrefix;
        },
        set: function (value) {
            if (value.length > 0) {
                if (value.charAt((value.length - 1)) == "/") {
                    value = value.substr(0, value.length - 1);
                }
                this._restPrefix = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SailsService.prototype, "serverUrl", {
        get: function () {
            return this._serverUrl;
        },
        set: function (value) {
            if (value.length > 0) {
                if (value.charAt((value.length - 1)) == "/") {
                    value = value.substr(0, value.length - 1);
                }
                this._serverUrl = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    SailsService.prototype.connect = function (url, opts) {
        if (this._connected) {
            this._io.disconnect();
        }
        if ('object' === typeof url) {
            opts = url;
            url = null;
        }
        if (url) {
            this.serverUrl = url;
        }
        else if (this._opts.url) {
            this.serverUrl = this._opts.url;
        }
        else if (!(this._serverUrl.length > 0)) {
            this._serverUrl = undefined;
        }
        this._opts.url = this._serverUrl;
        this._io = io.sails.connect(this._opts);
        this._connected = true;
    };
    SailsService.prototype.request = function (options) {
        var _this = this;
        var subject = new Rx_1.Subject();
        this.zone.runOutsideAngular(function () {
            _this._io.request(options, function (resData, jwres) {
                if (io.sails.environment != "production") {
                    console.log("request::data", resData);
                    console.log("request:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    subject.error(jwres.error);
                }
                else {
                    _this.zone.run(function () { return subject.next(resData); });
                }
                subject.complete();
            });
        });
        return subject.asObservable();
    };
    SailsService.prototype.get = function (url, data) {
        var _this = this;
        var subject = new Rx_1.Subject();
        this.zone.runOutsideAngular(function () {
            _this._io.get("" + _this._restPrefix + url, data, function (resData, jwres) {
                if (io.sails.environment != "production") {
                    console.log("get::data", resData);
                    console.log("get:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    subject.error(jwres.error);
                }
                else {
                    _this.zone.run(function () { return subject.next(resData); });
                }
                subject.complete();
            });
        });
        return subject.asObservable();
    };
    SailsService.prototype.post = function (url, data) {
        var _this = this;
        var subject = new Rx_1.Subject();
        this.zone.runOutsideAngular(function () {
            _this._io.post(url, data, function (resData, jwres) {
                if (io.sails.environment != "production") {
                    console.log("post::data", resData);
                    console.log("post:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    subject.error(jwres.error);
                }
                else {
                    _this.zone.run(function () { return subject.next(resData); });
                }
                subject.complete();
            });
        });
        return subject.asObservable();
    };
    SailsService.prototype.put = function (url, data) {
        var _this = this;
        var subject = new Rx_1.Subject();
        this.zone.runOutsideAngular(function () {
            _this._io.put(url, data, function (resData, jwres) {
                if (io.sails.environment != "production") {
                    console.log("put::data", resData);
                    console.log("put:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    subject.error(jwres.error);
                }
                else {
                    _this.zone.run(function () { return subject.next(resData); });
                }
                subject.complete();
            });
        });
        return subject.asObservable();
    };
    SailsService.prototype.delete = function (url, data) {
        var _this = this;
        var subject = new Rx_1.Subject();
        this.zone.runOutsideAngular(function () {
            _this._io.delete(url, data, function (resData, jwres) {
                if (io.sails.environment != "production") {
                    console.log("delete::data", resData);
                    console.log("delete:jwr", jwres);
                }
                if (jwres.statusCode < 200 || jwres.statusCode >= 400) {
                    subject.error(jwres.error);
                }
                else {
                    _this.zone.run(function () { return subject.next(resData); });
                }
                subject.complete();
            });
        });
        return subject.asObservable();
    };
    SailsService.prototype.on = function (eventIdentity) {
        var _this = this;
        if (!this._pubsubSubscriptions[eventIdentity] || this._pubsubSubscriptions[eventIdentity].isComplete) {
            this._pubsubSubscriptions[eventIdentity] = new Rx_1.Subject();
            this.zone.runOutsideAngular(function () {
                _this._io.on(eventIdentity, function (msg) {
                    if (io.sails.environment != "production") {
                        console.log("on::" + eventIdentity, msg);
                    }
                    _this.zone.run(function () {
                        _this._pubsubSubscriptions[eventIdentity].next(msg);
                    });
                });
            });
        }
        return this._pubsubSubscriptions[eventIdentity].asObservable();
    };
    SailsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], SailsService);
    return SailsService;
}());
exports.SailsService = SailsService;
//# sourceMappingURL=sails.service.js.map