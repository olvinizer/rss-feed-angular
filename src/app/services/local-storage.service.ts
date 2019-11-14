import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {
    private isLSAvailable = false;

    public constructor() {
        this.isLSAvailable = this.lsTest();
    }

    setItem(key: string, value: string) {
        if (this.isLSAvailable) {
            localStorage.setItem(key, value);
            return true;
        }
        return false;
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }

    removeItem(key: string) {
        if (this.isLSAvailable) {
            localStorage.removeItem(key);
        }
    }

    getObject(key: string) {
        const item = this.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    setObject(key, obj) {
        return this.setItem(key, JSON.stringify(obj));
    }

    isAvailable() {
        return this.isLSAvailable;
    }

    getKeys() {
        return this.isLSAvailable ? Object.keys(localStorage) : [];
    }

    private lsTest() {
        const test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}
