import Axios from 'axios';
import config from './config';

const axios = Axios.create({
  baseURL: config.backend.endpoint
});

const colors = {
  streamOpened: 'rgb(63, 62, 77)',
  streamClosed: 'rgb(63, 62, 77)',
  streamingError: 'rgb(189, 69, 65)',
  bg: undefined,
};

class Backend {

  public async getBinary(path: string): Promise<ArrayBuffer> {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return axios.get(`/storage/${path}`, {
      responseType: "arraybuffer"
    }).then((rep) => {
      return rep.data;
    });
  }

  public async listFiles(path: string): Promise<StorageFile[]> {
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return axios.get(`/storage/${path}`, {
      responseType: "json"
    }).then((rep) => {
      return rep.data;
    });
  }

  public async uploadFile(path: string): Promise<any> {
    return axios.post(`/storage/${path}`);
  }

  public async createDirectory(path: string): Promise<any> {
    return axios.post(`/storage/${path}`);
  }
}

let instance: Backend;

export default function getBackend() {
  if (!instance) {
    instance = new Backend();
  }
  return instance;
}