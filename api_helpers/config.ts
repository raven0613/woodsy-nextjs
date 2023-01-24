// api.js
import axios from "axios";
import 'axios'

declare module 'axios' {
    export interface AxiosRequestConfig {
        permissions?: string[]
    }

    export interface AxiosResponse{
        target?: any;
    }
}

const baseURL: string = 'http://localhost:3000/api/'

export const apiHelper = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000
});