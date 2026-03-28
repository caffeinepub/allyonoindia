import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Blob = Uint8Array;
export interface App {
    id: bigint;
    hot: boolean;
    logo: Blob;
    name: string;
    createdAt: bigint;
    downloadLink: string;
    version: string;
    stars: number;
}
export interface backendInterface {
    addApp(name: string, logo: Blob, downloadLink: string, hot: boolean, stars: number, version: string): Promise<bigint>;
    getApps(): Promise<Array<App>>;
    removeApp(id: bigint): Promise<boolean>;
    searchApps(term: string): Promise<Array<App>>;
    updateApp(id: bigint, name: string, logo: Blob, downloadLink: string, hot: boolean, stars: number, version: string): Promise<boolean>;
}
